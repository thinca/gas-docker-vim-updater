Docker Vim Updater
==================

Follow the feeds of [Vim's commits](https://github.com/vim/vim) and build a new Docker image when a new commit is arrive.

Setup
-----

1.  Setup Repository

    ```
    npm install
    ```

2.  Setup `clasp`
    See [official document](https://developers.google.com/apps-script/guides/clasp) for details.

    ```
    $ ./node_modules/.bin/clasp login
    ```

3.  Setup GAS Project

    1.  Create a new project

        ```
        $ ./node_modules/.bin/clasp create ...
        ```

    2.  Or, clone an existing project

        ```
        $ ./node_modules/.bin/clasp clone ...
        ```

Usage
-----

Generate the `Code.js` file that to upload to GAS.

```
$ ./node_modules/.bin/webpack
Hash: 3a00f0d51e17ffea6b80
Version: webpack 4.10.0
Time: 2732ms
Built at: 2018-06-28 20:32:49
  Asset      Size  Chunks             Chunk Names
Code.js  17.7 KiB    main  [emitted]  main
Entrypoint main = Code.js
[./node_modules/webpack/buildin/global.js] (webpack)/buildin/global.js 509 bytes {main} [built]
[./src/github.ts] 2.87 KiB {main} [built]
[./src/index.ts] 2.41 KiB {main} [built]
    + 3 hidden modules
```

Upload `Code.js` to GAS.

```
$ ./node_modules/.bin/clasp push
```
