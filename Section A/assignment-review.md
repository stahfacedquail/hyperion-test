# Code review: Python task
## Overall feedback
This is a very good solution!  It is quite close to solving the problem that was presented, so well done for the strides you have taken so far.  It is especially impressive as it only takes one loop through the array of the strings to group the anagrams, where a more simplistic solution could easily have reached a time complexity of _O(n^2^)_.

There are just three issues I would like for us to address.

## 1. Indentation
On execution of the program, we get this error:
```
... line 3
result = {}
^
IndentationError: unindent does not match any outer indentation level
```
Remember that indentation is very important in Python; it helps Python figure out which code belongs to different portions of logic in the program.  In this case, Python is confused because on line 2, we declare a function (`groupAnagrams`), and where it's expecting us to indent inwards and (most likely) proceed to define this function's logic, it now sees we've indented outwards on line 3, which messes up the flow of things.  How do you think we can fix this?

## 2. `sorted`
On fixing the issue above, we then run into another error:
```
line 5, in groupAnagrams
TypeError: sorted expected 1 argument, got 0
```
Before reading up on the documentation for this built-in method, maybe let's think about what argument `sorted` might be missing from us.  In line 5, we're trying to:
* split the string into its individual characters,
* sort those characters alphabetically,
* then join those characters back into a string.

Can you identify in the code where all those parts of the logic are happening?

## 3. Documentation
While I found your code easy enough to follow, I think it could be even easier to follow with either or both of the following:
1. A comment giving an overview of how the function works
2. More descriptive variable names, e.g. replacing `result` with `word_dict`