const ACTIONS = {
    ADDED : 'ADDED',
    UPDATED : 'UPDATED',
    DELETED : 'DELETED',
    EQUAL: 'equal',
}

const TYPES = {
    FUNCTION : 'function',
    OBJECT : 'object',
    ARRAY : 'array',
    DATE : 'date',
    NUMBER : 'number',
    STRING : 'string',
    UNSUPPORTED : 'unsupported',
    UNKNOWN : 'unknown'
}

const typeHash = {}
Object.keys(TYPES).forEach(key => {typeHash[TYPES[key]] = TYPES[key]})

const getType = (obj) => {
    let type = typeof obj;
    if (obj === null || type === 'undefined') return TYPES.UNKNOWN;
    if (type === TYPES.OBJECT && Array.isArray(obj)) return TYPES.ARRAY;
    if (!typeHash[type]) type = TYPES.UNSUPPORTED;
    return type;
}

const compare = (left, right, type) => {
    return left === right;
}

const diff = (left, right, opt = {}) => {
    const result = []

/*    console.log({
        left,
        right,
        opt,
    })*/

    if (left == null && right == null) {
        return result;
    }
    
    const lDataType = getType(left);
    const rDataType = getType(right);
    const ignore = opt.ignore || []
    const path = opt.path ? (opt.key !== null ? opt.path.concat('.', opt.key) : opt.path) : (opt.key || '')

    if (opt.key && isNaN(opt.key) && ignore.indexOf(opt.key)>=0) {
        return result;
    }

    if (lDataType!==TYPES.UNKNOWN && rDataType!==TYPES.UNKNOWN && lDataType !== rDataType) {
        throw new Error(`Invalid types ${lDataType}!==${rDataType} at ${path}`)
    }

    // consolidate type
    const dataType = lDataType!==TYPES.UNKNOWN ? lDataType : rDataType;

    // validate type
    if (dataType === TYPES.UNKNOWN) {
        throw new Error(`Invalid type ${dataType} at ${path}`)
    }

    // make sure its not a function
    if (dataType === TYPES.FUNCTION) {
        throw new Error(`Functions not supported at ${path}`)
    }

    // console.log(dataType)

    if (dataType === TYPES.OBJECT) {
        const keys = [...new Set([...Object.keys(left || {}), ...Object.keys(right || {})])]

        // const values = []
        keys.forEach(key => {

            // console.log({key, left, right})

            diff(left ? left[key] : null, right ? right[key] : null, {
                path, 
                key,
                ignore,
            }).forEach(r => result.push(r))

            // console.log({c})
        })

    } else if (dataType === TYPES.ARRAY) {

        const lArray = left || [];
        const rArray = right || [];

        const key = 'id';
        const typesInArray = [...new Set(lArray.concat(rArray).map(getType).filter(t => t !== TYPES.UNKNOWN))]
        if (typesInArray.length === 0) {
            return result;
        } else if (typesInArray.length>1) {
            throw new Error(`Conflicting dataTypes in array ${path} ${typesInArray}`)
        }
        const objType = typesInArray[0]

        const compareEntry = (a, b) => {
            if (objType === TYPES.OBJECT) return a[key]===b[key];
            return compare(a, b, objType)
        }

        const arrayResult = {
            added: [],
            updated: [],
            deleted: []    
        }
        
        rArray.forEach((entry, index) => {
            const matches = lArray?.filter(obj => compareEntry(obj, entry))
            if (matches.length > 0) {
                matches.forEach(left => {
                    arrayResult.updated.push({
                        index,
                        left,
                        right: entry,
                    })
                })
            } else {
                arrayResult.added.push({
                    index,
                    left: null,
                    right: entry,
                })
            }
        })

        lArray.filter((left, index) => {
            if (rArray.filter(obj => compareEntry(left, obj)).length === 0) {
                arrayResult.deleted.push({index, left, right: null})
            }
        })

        // console.log(arrayResult)

        Object.keys(arrayResult).forEach(key => {
            arrayResult[key].forEach(({left, right, index}) => {
                switch (key) {
                    case 'exists': 
                        diff(left, right, {
                            path,
                            key: index,
                            ignore,
                        }).forEach(r => result.push(r))  
                        break;
                    case 'deleted':
                        result.push({
                            action: ACTIONS.DELETED,
                            dataType: getType(left),
                            path: path.concat('.', index),
                            left: left,
                            right: null,
                        })
                        break;
                    case 'added':
                        result.push({
                            action: ACTIONS.ADDED,
                            dataType: getType(right),
                            path: path.concat('.', index),
                            left: null,
                            right: right,
                        })
                        break;
                }
            })
        })
        
    } else {
        if (!compare(left, right, dataType)) {
            result.push({
                action: ACTIONS.UPDATED,
                dataType,
                path,
                left,
                right,
            })
        }
    }

    return result
}

module.exports = diff