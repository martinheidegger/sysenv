# sysenv

Tool to identify the current state of the node.js environment to a great detail.

NOTE: This is in the pre-release stage as of Nov 2015. Use on own risk

## Installation

```
$ npm i sysenv -g
```

## Usage

To gather all information that we can currently gather run 

```
$ sysenv
```

You can limit the output for selected properties by adding a `--prefix` option
that will show only properties starting with the passed-in prefix.

Example: Only terminal information

```
$ sysenv --prefix term
```

You can limit the output to show only properties that are okay to be shown in public:

```
$ sysenv --anonymous
```


