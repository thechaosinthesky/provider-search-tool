# provider-search-tool
Display provider search results from the NIPPES api.

## Features:

* Enter a National Provider ID (NPI) and retrieve provider information from the national records. (example NPI values: 1720562333, 1336690593, 1013593243)

* Maintain a list of searched providers, even after closing and opening the web page. Results are stored in local storage.

## Requirements:

* Ruby version: 2.7.5

## Getting Started

Install required gems. Execute:
```
bundle install
```

## Unit Tests

To be added. To run unit tests execute:
```
rspec
```

## Upcoming features

* Advanced search fields available in a 2nd tab, to search by name or other fields

* Ability to save named lists of providers, which will be displayed in additional dynamic tabs. These results will be persisted when the page is closed and reopened.

* Ability to store named lists in a No SQL backend database
