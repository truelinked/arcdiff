# arcdiff

Simple compare between data structures

# Install

```
npm install arcdiff
```

# Usage

```
const diff = require('arc-diff')

const a = {
    name: 'John',
}
const b = {
    name: 'Doe',
}
const result = diff(a, b)
```

# API Interface

```
diff(left, right, options )
```

- left: Left side of compare

- left: Right side of compare

- options: 
    - ignore
