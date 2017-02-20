(function($) {

    "use strict";

    var months = [
        "janvāris",
        "februāris",
        "marts",
        "aprīlis",
        "maijs",
        "jūnijs",
        "jūlijs",
        "augusts",
        "septembris",
        "oktobris",
        "novembris",
        "decembris"
    ];

    var days = [
        "Pirmdiena",
        "Otrdiena",
        "Trešdiena",
        "Ceturtdiena",
        "Piektdiena",
        "Sestdiena",
        "Svētdiena"
    ];


    $(document).on("wheel", callScroll);
    $(document).on("mousedown", callScroll);
    $(document).on("touchstart", callScroll);


    var scrollInterval;
    var currAnim;
    callScroll();
    refreshData();

    // QR Code
    generateQrCode();

    // 1000 - 1 second
    // result - 5minutes
    var time = 1000 * 60 * 5;

    // repeating request every 5 minutes
    setInterval(refreshData, time);


    /**
     * requests data for the table
     *
     */
    function requestData()
    {
        $.ajax({
            url: "request.php",
            type: "post",
            success: function(data) {
                $("#lectures-table tbody").empty();

                var json = JSON.parse(data);
                console.log(data);
                console.log(json);

                var rowNumber = 0;
                for (var i = 0; i < json.length; i++)
                {
                    //for (var j = 0; j < json.length; j++)

                    // converting to an array if since in case of single element
                    // the element is not contained inside an array
                    for (var j = 0; j < 2; j++)
                    {
                        if ( ! Array.isArray(json[i].laiks))
                            json[i].laiks = [json[i].laiks];
                        if (json[i].laiks)
                        {
                            processData(json[i].laiks[j], rowNumber, !j);
                            if (j == 1)
                                $("#row" + rowNumber).css({ "color": "#7a8185", "font-weight": 200 });
                            rowNumber++;
                        }

                    }
                }
            }
        });
    }


    /**
     * Returns the names of today
     * from the json file
     */
    function requestTodaysNames()
    {
        $.ajax({
            url: "namedays.php",
            type: "post",
            success: function(data) {
                $("#todays-names").text("Vārda dienas:\n" + data);
            }

        });
    }


    /**
     * Adds a whole row to the table
     *
     */
    function addLecturer(room, time, lecture, name, rowNumber)
    {
        var $row = $("<tr>", {
            id: "row" + rowNumber
        }).append(createCell(room),
            createCell(time),
            createCell(lecture),
            createCell(name));
        $("#lectures-table").append($row);
    }


    /**
     * Adds one cell to the table
     *
     */
    function createCell(text)
    {
        return $("<td>", { text: text });
    }


    /**
     *  takes and object
     *  pulls out the necessary data
     *  and adds it to the table
     */
    function processData(data, rowNumber, includeRoom)
    {

        // checking if the there's any content
        if (data == null || !data.telpa) return;
        
        var room = null;
        var time = null;
        var lecture = null;
        var name = null;

        // in case of 2 lectures being in the same time and place
        // the first one gets chosen
        if (Array.isArray(data.telpa))
            data.telpa = data.telpa[0];

        if (data.telpa.nos)
        {
            // room is required
            room = data.telpa.nos;

            // check the time
            if (data.no)
                time = data.no;

            // checking the course name
            if (data.telpa.kurs && data.telpa.kurs.nos)
                lecture = data.telpa.kurs.nos;

            // checking the lecturer's name
            if (data.telpa.kurs.pasn)
                name = data.telpa.kurs.pasn;
        }
        else return;

        // adding a row
        addLecturer(includeRoom ? room : "", time, lecture, name, rowNumber);

    }


    /**
     * generates qr code image
     *
     */
    function generateQrCode()
    {
        var url = window.location.href;
        var container = document.getElementById("qr-code");
        var qrcode = new QRCode(container, url);
        $("#qr-code").find("img").appendTo($("#ar-code"));
        $("#qr-code canvas").remove();
    }


    /**
     * returns a text stating the current date
     *
     */
    function getCurrDate()
    {
        var date = new Date();
        var year = date.getFullYear();
        var month = months[date.getMonth()];
        var day = date.getDate();
        var weekDay = days[date.getDay()];
        return weekDay + ", " + year +
               ". gada " + day + ". " + month;
    }


    /**
     * refreshes the current date and
     * requests the data for the table
     * and daily names
     */
    function refreshData()
    {
        $("#date").text(getCurrDate());
        requestTodaysNames();
        requestData();
    }


    /**
     * starts to scroll up and down repeatedly
     * 
     */
    function callScroll()
    {
        // canceling out any previous interval
        clearTimeout(scrollInterval);
        var speed = $(window).height() * 15;
        $("html, body").stop();

        scrollInterval = setInterval(function() {
            currAnim = $("html, body").animate({
                scrollTop: $(document).height() - $(window).height() },
                speed, function() {
                $(this).animate({ scrollTop: 0 }, speed);
            });
        }, speed * 2);
    }


})(jQuery);
