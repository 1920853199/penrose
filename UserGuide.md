In `penrose/react-renderer/src`, run `npm start`
In `penrose/examples/` run `runpenrose my.sub my.sty my.domain`

Shape library:
https://github.com/penrose/penrose/wiki/Shape-and-function-library

Tensor flow math operations:
https://js.tensorflow.org/api/latest/#Operations

# Adding new constraints

First, add the function definitions here:

* `src/react-renderer/Constraints.ts`
* `src/Penrose/Functions.hs`

Next, rebuild Penrose by typing `stack build` in `penrose/`

# Setup

Clone Penrose repo https://github.com/penrose/penrose.git
  -- Do we want a "slim" repo for deployment?
-- Do we want a Build.md that redirects to the repo wiki?
Install Haskell stack via Homebrew: brew install haskell-stack
-- can we do a one-click build/installer/CMake file?
-- would be good to insert description of how to build headless version
-- tell people [how] to install node + npm <--- not standard for most people
   brew install node
-- there are two frontends:
   1. react-renderer -- installed (but not built) by default
   2. use.penrose -- must install
? which frontend does "the frontend" refer to in the wiki?
   cd into penrose/react-renderer
   npm install
   npm run build-lib
   npm link
   cd into penrose-ide/ide-frontend
   npm link react-renderer
   cd into penrose
   stack build
   To run react renderer:
      npm-start in penrose/react-renderer
   Then run Penrose with .dsl/.sub/.sty triple
   To clean up/rebuild Penrose from scratch
      stack clean
      stack install
   Should be installed somewhere like ~/.local/bin/penrose
Penrose IDE (use.penrose): [ can we put more of this in a build script? ]
  To install:
     From the same directory containing `penrose`, run
        git clone https://github.com/penrose/penrose-ide.git
        cd penrose-ide/ide-frontend
        npm install
        cd into penrose-ide/substance-languageservice
        npm install
  To run:
     cd penrose-ide/ide-frontend
     npm start
   Stuff that shows up is determined by penrose/penrose/tree/master/examples/*Library.json
  NOTE: Penrose IDE didn't connect to the server
