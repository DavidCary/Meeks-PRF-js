Meeks-PRF-js
============

Count votes for a Meek's method RCV / STV election contest using Javascript
software.

# Table of Contents

  * [Quick start](#quick-start)
  * [Introduction](#introduction)
  * [Version](#version)
  * [Repository structure](#repository-structure)
  * [Use examples](#use-examples)
  * [Testing](#testing)
  * [Limitations](#limitations)
  * [Extensions](#extensions)
  * [Other commands](#other-commands)
  * [Licensing](#licensing)


## Quick start

For use with Node, this package can be installed with npm,
by creating a new directory / folder, for example __`meeks-prf`__,
and then from the command line, changing to that directory and running
the command:

    npm install @dcary/meeks-prf-js

You can then tabulate a contest with the command:

    node . input.json results.json

where the file __`input.json`__ has the contest input data and
__`results.json`__ is the output file to which results will be written.
A sample input file is provided at __`./uses/sample-01-in.json`__.

More generally, if the current directory is not the project directory,
you can use the command:

    node path-to/meeks-prf input.json results.json

Other ways of using the package are described below.


## Introduction

Use this Javascript package to count votes for a
ranked choice voting (RCV) /
single transferable vote (STV) election contest
using the Proportional Representation Foundation's
 [reference rule for Meek's method](
https://prfound.org/resources/reference/reference-meek-rule/) and
various extension to that rule.

The Javascript programs in this package can be directly used
in modern browsers.
The package also includes versions of those programs that have been
converted for use in Node.
Use in other browsers requires additional support not included in
this package.

Meek's method is a form of RCV / STV that supports proportional
representation in multi-winner elections.
It can provide a fairer and more comprehensive transfer of surplus
than other forms of STV,
including variations of the weighted inclusive Gregory method (WIGM)
which also involves transfers of surplus as fractions of a vote.
Any form of STV tends to provide fairer results than other
traditional election methods
and greatly reduces the practical opportunities for tactical
voting.
However Meek's method accomplishes this better than
and precludes some of the opportunities for tactical voting
that still exist with other forms of STV, including varieties of WIGM.
However the tradeoff is that Meek's method is more computationally
intensive,
to the extent that it is typically not practical to count votes with
Meek's method without the assistance of a computer for contests with
more than a few winners.

The reference rule published by the Proportional Representation
Foundation is particularly significant because it ensures that
independent but conforming implementations will always produce the same
result, provided that any ties are consistently resolved.


## Version

This is version 0.9.1 of the Meeks-PRF-js project. It has stable, well
tested functionality.
The 0.9.x versions will be used to refine initial
published packaging.
This version includes similar functionality of v3.0.0 of
[a related Python project](
https://bitbucket.org/David-Cary/meeks-prfound/src/master/),
with some additional improvements.


## Repository structure

The __`src`__ directory contains the Javascript
vote counting programs that can be run directly in modern browsers and
which are ES modules.
The __`run`__ directory has corresponding programs that can run in
Node v10 and later.  The __`tests`__ directory contains
test programs and data.  The __`docs`__ directory has public API
documentation as HTML.

The vote counting tabulation algorithm can be invoked with the
__`Meek.tabulate()`__ function, where __`Meek`__ is the imported /
required name
for the __`meek.js`__ file from either the __`src`__ or __`run`__
directories.  Those files contain additional documentation
about the __`tabulate()`__ function.


## Use Examples

Three ways to run a Meek's method tabulation are:

  * [Caller gives data directly](#markdown-header-caller-gives-data-directly)
  * [Caller gives data in JSON files](#markdown-header-caller-gives-data-in-json-files)
  * [Command line using JSON files](#markdown-header-command-line-using-json-files)

### Caller gives data directly

After importing / requiring __`meek.js`__, for example with:

    import * as Meek from 'path-to/src/meek.js';

tabulation of RCV votes can be accomplished by calling the
__`Meek.tabulate()`__ function, which is defined with the signature:

    function tabulate(nbrSeatsToFill, candidates, ballots,
          maxRankingLevels, tieBreaker, excluded, protectedzz,
          options={}, progressCallback=null):

For example:

    const results = Meeks.tabulate(1, " A B C", [
          [4, ' A B C'],
          [3, ' B A C'],
          [2, ' C B A']
          ],
          3, ' C A B', '', '', {}, null);

will tabulate a contest that:

  * Produces one winner.
  * Has three candidates with identifiers A, B, and C.
  * Has nine ballots, two of which rank C first, B second, and A third.
  * Allows a voter to rank up to three candidates.
  * Uses a tie breaker ranking for resolving ties, picking for
    elimination the earliest ranked candidate of any tied candidates; so
    C is picked for elimination if tied with A or B (or both) and A is
    picked for elimination if tied only with B.
  * No candidates are excluded from the tabulation.
  * No candidates are protected from defeat and thus assured of being
    elected.
  * Does not specify any special tabulation options.
  * Does not use a progress callback function.

The above example uses a short cut for specifying a sequence of strings
by writing them in a single, delimiter-separated string with the first
character specifying what the delimiter is.

The result of the function is a data object that includes the following
three properties:

  * 'elected', a set of winners.
  * 'statuses', a data object showing the status of each candidate.
    * Whether the candidate was elected or defeated.
    * The round in which the candidate was elected or defeated.
    * The candidate's vote total when elected or defeated.
    * The candidate's keep factor for the last tabulation iteration.
    * Whether the candidate was pre-designated as being excluded or
      protected.
  * 'tally', a data object showing the round-by-round vote totals and
    other statistics of the tabulation.

For the example mentioned above, the results would be as if the
following assignments had occurred:

    results.elected = new Set(['B'])
    results.statuses = {
          'A': Status('A', 'defeated', 2, D(4.0), D(1.0)),
          'B': Status('B', 'elected',  2, D(5.0), D(1.0)),
          'C': Status('C', 'defeated', 1, D(2.0), D(0.0))
          }
    results.tally = {
          'A': [D(4.0), D(4.0)],
          'B': [D(3.0), D(5.0)],
          'C': [D(2.0),],
          ':Votes for candidates': [D(9.0), D(9.0)],
          ':Overvotes': [D(0.0), D(0.0)],
          ':Abstentions': [D(0.0), D(0.0)],
          ':Other exhausted': [D(0.0), D(0.0)],
          ':Total votes': [D(0.0), D(0.0)],
          ':Quota': [D(4.500000001), D(4.500000001)],
          ':Total surplus': [D(0.0), D(0.499999999)],
          ':Iterations': [1, 1]
          }

where __`D`__ is an alias for the __`Decimal9`__ class, which is
used internally to represent numbers of votes.

### Caller gives data in JSON files

An alternative way to run a tabulation is with the
__`WithJson.tabulate()`__ function, where __`WithJson`__ is the name for
the default export from the __`with_json.js`__ file.
That function reads the
tabulation input from a named JSON file and writes the results in a JSON
format to a file.

For example, the previous example can be tabulated using a file named
__`example.json`__ with the following content:

    {
      "description": "An example RCV contest"
      ,"nbrSeatsToFill": 1
      ,"candidates": " A B C"
      ,"ballots": [
        [4, " A B C"],
        [3, " B A C"],
        [2, " C B A"]
        ]
      ,"maxRankingLevels": 3
      ,"tie_breaker": " C A B"
      ,"excluded": ""
      ,"protected": ""
      ,"options": {}
    }

and then executing the Javascript statement:

    async [const results, tab_spec] = WithJson.tabulate(
          'example.json', 'example-results.json')

which writes a file __`example-results.json`__ with the following
content:

    {
      "description": "An example RCV contest"
      ,"elected": ["B"]
      ,"status": [
        ["B", "elected", 2, 5.0, 1.0],
        ["A", "defeated", 2, 4.0, 1.0],
        ["C", "defeated", 1, 2.0, 0.0]
      ]
      ,"tally": {
        "B": [3.0, 5.0],
        "A": [4.0, 4.0],
        "C": [2.0],
        ":Votes for candidates": [9.0, 9.0],
        ":Overvotes": [0.0, 0.0],
        ":Abstentions": [0.0, 0.0],
        ":Other exhausted": [0.0, 0.0],
        ":Total votes": [9.0, 9.0],
        ":Quota": [4.500000001, 4.500000001],
        ":Total surplus": [0.0, 0.499999999],
        ":Iterations": [1, 1]
      }
    }

If the second argument is omitted or set to the empty string, the JSON
output is printed to __`stdout`__.

The __`results`__ return value is the same as returned by the
__`Meek.tabulate()`__ function.  The second return value is a data
object that documents the merged tabulation input specifications.  It
reflects what was found in the input JSON file and any included files.
The input JSON file can have an 'include' property with a value that is
a list of JSON file names from which other property/values are included,
but which can be overridden by corresponding property/values in the
primary input JSON file.

In the above example, the lines indicating that there are no excluded
candidates and no protected candidates could be omitted, since those are
the default values for JSON files.

### Command line using JSON files

A third way to run an RCV tabulation is from the command line using
Node. This was mentioned in the quick start section.
The previous example could be run as:

    node path-to/run example.json example-results.json

If the __`example-results.json`__ argument is omitted or given as an
empty string, the JSON results are printed to __`stdout`__.

Note that the second command line value, the one following 'node',
can name either the project directory or its __`run`__ directory.


## Testing

Tests can be run using Jest.  When this package is installed using
npm, Jest is also installed as one of its development dependencies.

To run tests, change the working directory to the
__`tests`__ directory and run the command:

    npm run test

That should run 21 test suites with a total of 559 tests,
all without errors, typically in less than 15 seconds,
though speeds can vary depending on the type of computer being used.

There are two kinds of tests in the __`tests`__ directory tree:

  * more traditional unit tests specified in
    __`tests/unit/*test.js`__
    files and which are typically dependent on the internal design and
    implementation details of programs in the __`src`__ directory.

  * tests with inputs and expected results that are specified in JSON
    files and which are designed to be typically applicable to any
    conforming implementation of the reference rule, except for those
    tests that apply to extensions to the reference rule.

The JSON-based tests are typically run from a \*test.js file in the same
directory as the JSON files specifying the test.  A group of related
tests are specified in similarly named JSON files, sometimes sharing a
base JSON file for common data.  For example, files __`abc-007-1.json`__
and __`abc-007-2.json`__ might specify two related tests and reference
(include and possibly override) a common __`abc-007-base.json`__ file.

The JSON files specify a JSON object which is convertible to a
Javascript data object and which includes a __`"description"`__
property.

Global parameters for the JSON-based test cases may be set in the file
__`tests/all-tests-spec.json`__.


## Limitations

This implementation focuses on the core vote counting algorithms and
does not offer all of the functionality that might be expected to
support tabulation of an election. For example, it does not directly
supply support for end-user report formats.

Neither the programs nor the test cases enforce specific maximum
limitations on the sizes of input to the STV tabulation.  Sizes of
contests that can be tabulated generally depend on the amount of
resources, especially memory, available to the software.

This package can reliably handle large numeric values up to
9,000,100 to nine decimal places of accuracy. The program will not
accept more than that many ballots as input, even if they have been
pre-summarized into fewer ballot groups.

Numeric values much larger than that start to lose precision when
converting to or from native Javascript number values and to or
from JSON number values.

This implementation can use ballot trees to more efficiently process
large numbers of ballots with larger numbers of rankings.  However this
version does not attempt to strictly minimize the resources that are
used or to manage a time vs. space tradeoff.

As an example of what this program can accomplish,
it has tabulated in a desktop browser
non-trival contests with half a million individual ballots,
none of them pre-summarized into multi-ballot ballot groups,
each ballot ranking 100 candidates,
and the contest electing 20 winners.
Such tabulations complete within a few minutes.
Due to special cases that result in persistently slow convergence rates,
it is possible that smaller contests could take extraordinarily long
to tabulate.

In order to focus on issues of core functionality, all test data has been
limited to using ASCII characters.


## Extensions

This implementation includes several extensions to the reference rule.
These include::

* Handling anomalous ranking patterns.
* Reporting some exhausted votes as abstentions.
* An option to always count votes for at least one round.
* An option for whether or in which rounds to check for
  perform alternative defeats
  (a.k.a. multiple defeats).
* An option for when in a round to check for
  performing alternative defeats.
* Support for vacancy re-tabulations,
  including the ability to designate some candidates as being excluded
  (a.k.a. withdrawn)
  and others as being protected
  from defeat and thus be assured of being elected.
* An option for helping tabulations run faster by internally
  representing the rankings of ballots and ballot groups in a
  ballot tree.

The rest of this section briefly describes each of these extensions.
The extensions are also described
in the HTML-based documentation of the public API.

The anomalous ranking patterns that are allowed include::

  * duplicate rankings (ranking the same candidate more than once at
    different ranking levels)
  * overvoted rankings (ranking two or more different candidates at
    the same ranking level on a ballot)

The reference rule implicitly assumes that these anomalous ranking
patterns do not occur in the ballots submitted for tabulation.  See the
documentation for the __`Meek.Tabulation`__ class for the
specifics of how these anomalous ranking patterns are handled.

There is an option, turned on by default, that counts votes for the
first round even if doing so is not required to determine all winners
because there is not an excess of hopeful candidates.  The reference
rule can be strictly followed in this regard by using the option
`{"always_count_votes": false}` in Javascript or JSON.
The value of this option has no effect if
there is an excess of hopeful candidates and as a result, counting votes
for one or more rounds is required to determine winners.

There are two options that control whether and how alternative defeats
are performed.
Alternative defeats can involve defeating one or more candidates at a
point in the tabulation when no candidates or only one candidate would
be defeated.
Alternative defeats are also known as multiple defeats, batch defeats,
and deferred surplus distribution.
By default, alternative defeats are not performed.

Alternative defeats can be activated
with the __`alternative_defeats`__ option,
setting it to a value of "Y" value
or activating it only for certain rounds
with a sequence of "Y"s and "N"s.

There is also an option, __`"type_of_altdefs"`__,
that controls the point in the tabulation algorithm
at which the alternative defeats is checked.
In order for this option to have an effect on a round,
the __`"alternative_defeats"`__ option
must be a __`"Y"`__ for the round.
In addition to doing the check at the end of step B.2.e,
as allowed by the reference rule,
there are also options to check in the middle of step B.2.e,
if no candidates were elected in the iteration,
or to check at the beginning of step B.3,
just before doing end-of-round single defeats.

There is support to exclude and protect candidates.  An excluded
candidate is not eligible to be elected or receive votes and is marked
as defeated before the first round of tabulation.  The reference rule
uses the term "withdrawn" rather than "excluded".  A protected candidate
is assured of being elected.

The ability to exclude and protect candidates can be useful when using
the ballots of a previous election to fill one or more vacancies.  For a
typical use case, exclude all previous candidates who are unwilling or
otherwise not eligible to fill the vacancies, protect all candidates
that will continue to serve, set the number of seats to fill to the sum
of the number of protected candidates plus the number of vacancies to
fill, and then retabulate the contest.

When there are protected candidates, there are separate quotas for
protected candidates and unprotected candidates in order to ensure that
an excess of unprotected candidates will not be elected.

In order to help tabulations run faster for larger constests, there are
options to use a ballot tree to represent ballots internally.
If used, the ballot tree can be either static or dynamic.


## Other commands

Other development commands defined for this project include:

+ `npm run build`

  Will re-build the node-compatible versions of the programs in the
  __`run`__ directory.

+ `npm run build-one -- src/<file-name.js>`

  Will re-build in the __`run`__ directory
  a single node-compatible version of the file(s) listed at the 
  end of the command.

* `npm run build-docs`

  Will re-build the HTML-based documentation of the public API
  that is stored in the __`docs`__ directory.

* `node path-to/<package-directory> --version`

  or

  `node path-to/run --version

  Will print the version number
  which consists of a major, minor, and patch version number
  using semantic versioning.


## Licensing

This project is licensed under the Apache License, Version 2.0 (the
"License"); you may not use contents of this repository except in
compliance with the License.  A copy of the License is in the LICENSE
file and may also be obtained at:

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

Copyright 2016-2019 David Cary; licensed under Apache License, Version 2.0
