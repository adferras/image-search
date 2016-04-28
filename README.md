# Image Search

This has been created to fulfill the `Image Search Abstraction Layer` assignment from [freecodecamp](http://www.freecodecamp.com)

This app has been deployed to the following locations:
[Heroku](http://image-search-1690.herokuapp.com)

## This app fulfills the following user stories:
I can get the image URLs, alt text and page urls for a set of images relating to a given search string.
I can paginate through the responses by adding a ?offset=2 parameter to the URL.
I can get a list of the most recently submitted search strings.

## Example Usage:
```
https://image-search-1690.herokuapp.com/api/imagesearch/denver%20broncos?offset=10
```

## Example Output:
```
[{"url":"http://i.imgur.com/BMSb8fA.jpg","snippet":"Wes Welker, of the Denver Broncos, correctly picked the Kentucky Derby winner. As he left he handed out $100 bills like candy.","thumbnail":"http://i.imgur.com/BMSb8fAs.jpg","context":"http://imgur.com/gallery/BMSb8fA"}]
```
