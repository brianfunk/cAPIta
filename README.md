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
 + leet
 + camel
 + pascal
 + snake
 + python
 + crazy
 + random
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
