// Date functions
function convertTime(timestamp) {
  var d = new Date(timestamp * 1000),hh = d.getHours(),h = hh,min = ('0' + d.getMinutes()).slice(-2),time;
  time = h+':'+min;
  return time;
}
function convertDate(timestamp) {
  var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],months = ['January','February','March','April','May','June','July','August','September','October','November','December'],d = new Date(timestamp * 1000),yyyy = d.getFullYear(),month = d.getMonth(),month = months[month],day = d.getDay(),day = days[day],dd = ('0' + d.getDate()).slice(-2),dateFormatted;
  dateFormatted = day+', '+dd+' '+month;
  return dateFormatted;
}

 var timeNow = Date.now()/1000;

$(document).ready(function() {
$.getJSON("https://sourcefabric.airtime.pro/api/week-info?callback=?",function(calendarProgram){
      var episode = "", episodeDay=false;
      for(var x in calendarProgram) {
        for (var y in calendarProgram[x]) {
          var z = calendarProgram[x][y],
              episodeName = z['instance_description'] || z['name'],
              episodeDate = z['starts'],
              episodeDateEnd = z['ends'];
          if (typeof episodeName !== 'undefined' && typeof episodeDate !== 'undefined') {

            // start time
            episodeDate = episodeDate.replace(/\W+/g, ',').split(',');
            episodeDate = new Date(episodeDate[0], episodeDate[1]-1, episodeDate[2], episodeDate[3], episodeDate[4], episodeDate[5]);

            // end time
            episodeDateEnd = episodeDateEnd.replace(/\W+/g, ',').split(',');
            episodeDateEnd = new Date(episodeDateEnd[0], episodeDateEnd[1]-1, episodeDateEnd[2], episodeDateEnd[3], episodeDateEnd[4], episodeDateEnd[5]);

            var episodeDateUnix = episodeDate.getTime() / 1000,
                episodeDateISO = moment.unix(episodeDateUnix).toISOString(),
                episodeTime = convertTime(episodeDateUnix),
                // episodeTime = episodeTime.replace(':00', '00'),

                episodeDateEndUnix = episodeDateEnd.getTime() / 1000,
                episodeDateEndISO = moment.unix(episodeDateEndUnix).toISOString(),
                episodeTimeEnd = convertTime(episodeDateEndUnix),
                // episodeTimeEnd = episodeTimeEnd.replace(':00', '00'),
                currentEpisode = '';

            if (typeof episodeName !== 'undefined' && timeNow < episodeDateEndUnix) {

              if (timeNow < episodeDateEndUnix && timeNow >= episodeDateUnix) {
                currentEpisode = ' current';
              }

              if (episodeDay !== convertDate(episodeDateUnix)) {
                episodeDay = convertDate(episodeDateUnix);

                var dayIsLiveLichtenberg = episode + "<div class='row calendar__date calendar__date--live'><div class='xs-10 xs-offset-2'>" + episodeDay +"<br/><span style='font-style: italic;'>Live from Lichtenberg</span></div></div>";
                var dayIsLiveArkaoda = episode + "<div class='row calendar__date calendar__date--live'><div class='xs-10 xs-offset-2'>" + episodeDay +"<br/><span style='font-style: italic;'>Live from Arkaoda</span></div></div>";
                var dayIsNotLive = episode+"<div class='row calendar__date'><div class='xs-10 xs-offset-2'><span>"+episodeDay+"</span></div></div>";


                if (typeof liveDays !== 'undefined') {
                  if (liveDays !== false && episodeIsLiveFromLichtenberg(episodeDay)==true) {
                    if (liveDaysOff !== false && episodeIsDayOff(episodeDay) == true) {
                      episode = dayIsNotLive;
                    } else {
                      episode = dayIsLiveArkaoda;
                    }
                  } else if (liveDays !== false && episodeIsLiveFromFilterhouse(episodeDay)==true) {
                    if (liveDaysOff !== false && episodeIsDayOff(episodeDay) == true) {
                      episode = dayIsNotLive;
                    } else {
                      episode = dayIsLiveLichtenberg;
                    }
                  } else {
                    episode = dayIsNotLive;
                  }
                } else {
                  episode = dayIsNotLive;
                }

              }
              episode = episode+"<div class='row calendar__show"+currentEpisode+"' itemprop='episode' itemscope itemtype='https://schema.org/RadioEpisode'><div class='xs-2' itemprop='publication' itemscope itemtype='https://schema.org/BroadcastEvent'><meta itemprop='startDate' content='"+episodeDateISO+"'><meta itemprop='endDate' content='"+episodeDateEndISO+"'>"+episodeTime+"</div><div class='xs-10' itemprop='name'>"+episodeName+"</div></div>";
            }
          }
        }
      }
      $('.calendar__data').append('<div class="row"><div class="xs-10 xs-offset-2"><h2>Weekly schedule (CET)</h2></div></div>');
      $('.calendar__data').append(episode);
    }).fail(function(){
      // failed to load
      $('.calendar__data').append('<p>There seems to be a temporary issue connecting to Airtime. Meanwhile you can <a href="/listen/">listen</a> to shows from the archive.</p>');
      homeButtons();
    });
});