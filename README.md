# AngularJS HKID check digit validation

`hkid-check.html` *page*

This is a little tool use to validate a set of HKIDs. Also for me to get more understand in AngularJS, have fun.
I need to perform data migration during my work, to prevent the typing mistakes and human errors. The tool uses a well known unofficial algorithm to perform Check Digit on HKID. Until this moment, the check digit algorithm, it seems to be correct, even the government never recognizes that.

## Demo
Let try on the [demo page](http://keithbox.github.io/AngularJS-HKID-check-digit-validation/hkid-check.html)

Usage
- Paste the HKID to the textarea
- The validation result will come out

## Features
- Validate a list of HKID(s)
- HKID length and format validation
  - cater for one/two character prefix case
  - whatever Parentheses or not
- HKID check digit algorithm validation
- HKID duplicate checking
- Display the result as a graphical user interface
	- display result as a table view with success or warning background color
	- display the check digit formual details of each HKID in the table view
	- provide a search function, quickly focus on valid/invalid case

## Requirement
- angularJS (must)
- bootstrap (optional)

## Download
Download [ZIP](https://github.com/keithbox/AngularJS-HKID-check-digit-validation/archive/master.zip) from GitHub

## Contributing
Please do not hesitate to perform your PULL requests when you found out some `bugs` or `problems`. I apologise in advance for the invalid message hard code in somewhere. For any ideas who would like to improve this little validation also are welcome. I will follow the action on pull requests and issues as soon as I can.

## License
`hkid-check.html` is licensed under the MIT license. [View license file](https://github.com/keithbox/AngularJS-HKID-check-digit-validation/blob/master/license)


<!-- ##Support and Donate -->
