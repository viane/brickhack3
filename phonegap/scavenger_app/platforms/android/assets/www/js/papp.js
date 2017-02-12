try {
    /*
     * Licensed to the Apache Software Foundation (ASF) under one
     * or more contributor license agreements.  See the NOTICE file
     * distributed with this work for additional information
     * regarding copyright ownership.  The ASF licenses this file
     * to you under the Apache License, Version 2.0 (the
     * "License"); you may not use this file except in compliance
     * with the License.  You may obtain a copy of the License at
     *
     * http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing,
     * software distributed under the License is distributed on an
     * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
     * KIND, either express or implied.  See the License for the
     * specific language governing permissions and limitations
     * under the License.
     */

    var elem = (new Spinner().spin(document.body)).el;

    

   $( document ).ajaxStart(function() {
        $(elem).show();
    });
    $( document ).ajaxComplete(function() {
        $(elem).hide();
    });

    // Initialize your app
    var myApp = new Framework7({
        template7Pages: true
    });

    // Export selectors engine
    var $$ = Dom7;

    // Add view
    var mainView = myApp.addView('.view-main', {
        // Because we use fixed-through navbar we can enable dynamic navbar
        dynamicNavbar: true
    });

    const BASE_URL = "http://selfie-scavenge-yehyaawad.c9users.io:8081";

    myApp.onPageInit('index', function(page) {
        $("body > div.views > div > div.navbar > div.navbar-inner.navbar-on-center > div.right > a > i").click(function() {
            mainView.router.load("search.html");
            console.log("CLICK")
        })
    });

    // Callbacks to run specific code for specific pages, for example for About page:
    myApp.onPageInit('game', function(page) {

        var taskid = "";

        $(".camera-icon").click(function() {
            $("#image-input").off("change");
            taskid = $(this).attr("data-id");
            console.log("CLIECKED");
            $("#image-input").click();
            $("#image-input").change(function() {
                $("#image-submit").click();
            });
        });


        $('#form1').on('submit', function(evt) {
            evt.preventDefault();

            var formData = new FormData(this);

            $.ajax({
                type: 'POST',
                url: 'https://selfie-scavenge-yehyaawad.c9users.io:8081/verifyimage/1.2',
                data: formData,
                cache: false,
                contentType: false,
                processData: false,
                success: function(data) {
                    console.log("success");
                    console.log(data);
                },
                error: function(data) {
                    console.log("error");
                    console.log(data);


                    alert("Error from Cognitive Services API!!")
                        // $("#check-icon",".task-card-"+taskid).show();
                        // $("#camera-icon",".task-card-"+taskid).hide();
                }
            }).done(function() {
                var params = {
                    // Request parameters
                };

                $.ajax({
                        url: "https://westus.api.cognitive.microsoft.com/vision/v1.0/tag",
                        beforeSend: function(xhrObj) {
                            // Request headers
                            xhrObj.setRequestHeader("Content-Type", "application/json");
                            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "d3aa94c0d5c34fafb7b090079228ef33");
                        },
                        type: "POST",
                        // Request body
                        data: '{"url": "https://selfie-scavenge-yehyaawad.c9users.io:8081/image.jpg"}',
                        dataType: "json"
                    })
                    .done(function(data) {
                        console.log(JSON.stringify(data));
                        for (var i in data.tags) {
                            console.log(data.tags[i].name)
                            if ($(".tags", ".task-card-" + taskid).text().indexOf(data.tags[i].name) > -1) {
                                $("#check-icon", ".task-card-" + taskid).show();
                                $("#camera-icon", ".task-card-" + taskid).hide();
                                $("#requirement", ".task-card-" + taskid).addClass("strike");
                                swal("Good job!", "You found it! Find the rest!", "success")
                                return;
                            }
                        }
                        swal("Nope!", "That's not it! Try again!", "error");
                    })
                    .fail(function(err) {
                        console.log(err);
                        console.log("error");

                        swal("Whoops", "Error from cognitive services API!", "warning")
                            // $("#check-icon",".task-card-"+taskid).show();
                            // $("#camera-icon",".task-card-"+taskid).hide();
                    });
            });
        })
    });

    myApp.onPageInit('search', function(page) {

        var gameCardTemplate = $('#game-card').html();
        var compiledGameCardTemplate = Template7.compile(gameCardTemplate);

        $.get(BASE_URL + "/allgames", function(data) {
            console.log(data);

            for (var i in data.allgames) {
                data.allgames[i].data = JSON.stringify(data.allgames[i]);
            }

            var html = compiledGameCardTemplate({
                games: data.allgames
            });

            $(".searchbar-found").html(html);

            $(".card").click(function() {
                console.log("CARD")
                var _this = $(this);
                var jsonStr = $(".data", _this).text();
                var data = JSON.parse(jsonStr);
                mainView.router.load({
                    url: "game.html",
                    context: data
                });
            });
        });

        var mySearchbar = myApp.searchbar('.searchbar', {
            searchList: '.list-block-search',
            searchIn: '.card-header'
        });

        console.log("SEARCH INIT");
    });

    console.log("End F7");

    console.log(window.location.href)

    var app = {
        // Application Constructor
        initialize: function() {
            console.log("initialize")
            this.bindEvents();
        },
        // Bind Event Listeners
        //
        // Bind any events that are required on startup. Common events are:
        // 'load', 'deviceready', 'offline', and 'online'.
        bindEvents: function() {
            document.addEventListener('deviceready', this.onDeviceReady, false);
        },
        // deviceready Event Handler
        //
        // The scope of 'this' is the event. In order to call the 'receivedEvent'
        // function, we must explicitly call 'app.receivedEvent(...);'
        onDeviceReady: function() {
            console.log("Device Ready...");
            app.receivedEvent('deviceready');
        },
        // Update DOM on a Received Event
        receivedEvent: function(id) {
            var parentElement = document.getElementById(id);
            var listeningElement = parentElement.querySelector('.listening');
            var receivedElement = parentElement.querySelector('.received');

            listeningElement.setAttribute('style', 'display:none;');
            receivedElement.setAttribute('style', 'display:block;');

            console.log('Received Event: ' + id);
        }
    };

}
catch (err) {
    console.log(err);
}
