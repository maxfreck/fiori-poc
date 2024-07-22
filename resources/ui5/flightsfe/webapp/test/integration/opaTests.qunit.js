sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'flightsfe/flightsfe/test/integration/FirstJourney',
		'flightsfe/flightsfe/test/integration/pages/FlightsList',
		'flightsfe/flightsfe/test/integration/pages/FlightsObjectPage'
    ],
    function(JourneyRunner, opaJourney, FlightsList, FlightsObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('flightsfe/flightsfe') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheFlightsList: FlightsList,
					onTheFlightsObjectPage: FlightsObjectPage
                }
            },
            opaJourney.run
        );
    }
);