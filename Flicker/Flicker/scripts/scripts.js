localStorage.searchHistory;

//Namespace

var flicker = {};

$(document).ready(function () {

    //Global variable

    flicker.imagesList = document.getElementById("imagesList");
    flicker.historyTable = document.getElementById("historyTable");
    flicker.searchValue = document.getElementById("searchValue");
    flicker.noSearchHistory = document.getElementById("noSearchHistory");
    flicker.emptyImagesList = document.getElementById("emptyImagesList");
    flicker.ResultsFor = document.getElementById("ResultsFor");
    flicker.clearHistoryBtn = document.getElementById("clearHistoryBtn");
    flicker.historyTitle = document.getElementById("historyTitle");
    flicker.historyTbody = document.createElement("historyTbody");
    flicker.searchTerms = [];

    //Initialize styles states

    flicker.noSearchHistory.style.display = 'none';
    flicker.emptyImagesList.style.display = 'block';
    flicker.ResultsFor.style.display = 'none';
    flicker.clearHistoryBtn.style.display = 'none';
    flicker.historyTitle.style.display = 'none';


    //Save recent searches

    if (localStorage.getItem("searchHistory") !== null) {
        flicker.searchTerms = JSON.parse(localStorage.getItem("searchHistory"));
    }

    //Search images on click

    flicker.searchImages = function () {

        //Check if search value is empty

        if ($("#searchTextValue").val().length == 0) {
            return;
        }

        //clear old search

        flicker.imagesList.innerHTML = "";

        //Hide error message - no search history

        flicker.noSearchHistory.style.display = 'none';

        //display value from Search field

        flicker.fieldSearch = document.mainSearch.searchterm.value;
        flicker.searchValue.textContent = flicker.fieldSearch;

        //display time

        flicker.displayCurrentDate(); //add hour

        //display Images from flicker

        flicker.getDataFromFlicker();

        //hide empty images list placeholder

        flicker.emptyImagesList.style.display = 'none';

        //Display search term title

        flicker.ResultsFor.style.display = 'block';

        //Display history content

        flicker.clearHistoryBtn.style.display = 'block';
        flicker.historyTitle.style.display = 'block';

    };

    //Get data from flicker api

    flicker.getDataFromFlicker = function () {
        $.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?", {
            tags: flicker.fieldSearch,
            format: "json"
        }, function (data) {
            flicker.response = data.items;
            if (flicker.response.length == 0) {
                console.log("Error")
            } else {
                flicker.displayImages();
                flicker.saveDataToLocalStorage();
            }
        });
    };

    //Display images list

    flicker.displayImages = function () {
        $.each(flicker.response, function (i, item) {
            flicker.imageItem = document.createElement("li");
            flicker.imageContent = document.createElement("figure");
            flicker.imageDeatails = document.createElement("figcaption");
            flicker.imageContainer = document.createElement("div");

            $("<span/>", {"class": 'imageAuthorId'}).text(item.author_id).prependTo(flicker.imageDeatails);
            $("<span/>", {"class": 'imageTitle'}).text(item.title).prependTo(flicker.imageDeatails);
            $("<img/>").attr("src", item.media.m).prependTo(flicker.imageContainer);

            flicker.imageContent.appendChild(flicker.imageContainer);
            flicker.imageContent.appendChild(flicker.imageDeatails);
            flicker.imageItem.appendChild(flicker.imageContent);
            flicker.imagesList.appendChild(flicker.imageItem);
        });
    };

    //Display current time

    flicker.displayCurrentDate = function () {
        flicker.currentTime = new Date();
        flicker.formattedCurrentTime = flicker.currentTime.toLocaleTimeString();
    };

    //Save search details on localStorage

    flicker.saveDataToLocalStorage = function () {

        var receivedData = {
            term: flicker.fieldSearch,
            currentTime: flicker.formattedCurrentTime,
            resultsCount: flicker.response.length
        };

        flicker.searchTerms.push(receivedData);

        localStorage.setItem("searchHistory", JSON.stringify(flicker.searchTerms));

        flicker.historyTable.innerHTML = "";

        flicker.displayHistotyTable();

    };

    //Display history details table

    flicker.displayHistotyTable = function () {

        if (flicker.searchTerms.length !== 0) {

            flicker.noSearchHistory.style.display = 'none';

            flicker.histotySearchTerms = flicker.searchTerms;

            flicker.historyTable.appendChild(flicker.historyTbody);

            flicker.histotySearchTerms.forEach(function (item) {
                var row = document.createElement("tr");
                var term_td = document.createElement("td");
                var term = document.createElement('button');
                term_td.appendChild(term);

                term.textContent = item.term;

                term.onclick = function () {
                    flicker.imagesList.innerHTML = "";
                    flicker.fieldSearch = item.term;
                    flicker.currentTime = new Date();
                    flicker.formattedCurrentTime = flicker.currentTime.toLocaleTimeString();
                    flicker.searchValue.textContent = flicker.fieldSearch;
                    $("#searchTextValue").val(flicker.fieldSearch);
                    flicker.emptyImagesList.style.display = 'none';
                    flicker.ResultsFor.style.display = 'block';
                    flicker.getDataFromFlicker();
                };

                var currentTime = document.createElement("td");
                currentTime.textContent = item.currentTime;

                var resultsCount = document.createElement("td");
                resultsCount.textContent = item.resultsCount;

                row.appendChild(term);
                row.appendChild(currentTime);
                row.appendChild(resultsCount);

                flicker.historyTable.appendChild(row);

                //Display history content

                flicker.clearHistoryBtn.style.display = 'block';
                flicker.historyTitle.style.display = 'block';


            });
        }
        else {
            flicker.noSearchHistory.style.display = 'block';
        }
    };

    flicker.displayHistotyTable();

    //Clear search history from the DOM & from localStorage

    flicker.clearHistory = function () {
        flicker.searchTerms = [];
        flicker.historyTable.innerHTML = "";
        flicker.noSearchHistory.style.display = 'block';
        flicker.clearHistoryBtn.style.display = 'none';
        flicker.historyTitle.style.display = 'none';
        localStorage.clear();
    };

});