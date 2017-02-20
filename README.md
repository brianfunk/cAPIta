[![cAPIta](https://capita.herokuapp.com/badge/crazy/capita)](https://capita.herokuapp.com/crazy/capita.json)
[![Heroku](http://heroku-badge.herokuapp.com/?app=capita&style=flat)](https://capita.herokuapp.com)
[![Semver](https://img.shields.io/badge/SemVer-2.0-blue.svg)](http://semver.org/spec/v2.0.0.html)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg?maxAge=2592000)](https://opensource.org/licenses/MIT)
[![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://github.com/ellerbrock/open-source-badge/)
[![LinkedIn](https://img.shields.io/badge/Linked-In-blue.svg)](https://www.linkedin.com/in/brianrandyfunk)

# cAPIta
cAPIta - Capitalization API

## Routes
**Capitalize:** /:*capType*/:*string*.:*extension*

+ *capType*: must be valid capType
 + same
 + none
 + proper
 + title
 + sentence
 + upper
 + lower
 + camel
 + pascal
 + snake
 + python
 + crazy
 + random
 + leet
 + reverse
 + spell
+ *string*: must be valid string
+ *extension*: must be valid extension
 + json
 + jsonp
 + html
 + txt
 + default (uses request content type)

**Badge:** /badge/:*capType*/:*string*

+ *capType*: must be valid capType (see list above, excludes spell)
+ *string*: must be valid string (limit 50 characters)
+ extension: not required (returns svg)
+ example: ![cAPIta Badge](https://img.shields.io/badge/cAPIta%20UPPER-HELLO%20WORLD-b5d4ff.svg)

## Copyright and license

Code and documentation copyright 2016 Brian Funk. Code released under [the MIT license](https://opensource.org/licenses/MIT).

