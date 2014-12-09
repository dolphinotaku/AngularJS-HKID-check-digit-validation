#AngularJS HKID check digit validation

This tool use to validate a set of HKIDs. The result will come out at once



##Requirement
- angularJS (must)
- bootstrap (optional)

##Function
- Handle a list of HKID(s)
- HKID length and format validation
  - cater for one/two character prefix case
  - whatever Parentheses or not
- HKID check digit algorithm validation
- HKID duplicate checking
- Display the result as a graphical user interface
	- display result as a table view with success or warning background color
	- display the check digit formual details of each HKID in the table view
	- provide a search function, quickly focus on valid/invalid case
