  var player = document.getElementById('player'),
      snapshotCanvas = document.getElementById('snapshot'),
      captureButton = document.getElementById('capture'),
      videoTracks,
      searchResults;

  var handleSuccess = function(stream) {
    player.srcObject = stream;
    videoTracks = stream.getVideoTracks();
  };

  captureButton.addEventListener('click', function() {
    var ctx = snapshot.getContext('2d');
    ctx.drawImage(player, 0, 0, snapshotCanvas.width, snapshotCanvas.height);

    var pngUrl = snapshotCanvas.toDataURL(),
        dataString = pngUrl.slice(22,pngUrl.length);

    Promise.resolve($('#searchResults').val(dataString)).then(()=> {
      console.log('Ok')
      $("#search-form").submit();
    });
    
    videoTracks.forEach(function(track) {track.stop()});
  });

  var front = false;
  //document.getElementById('flip-button').onclick = function() { front = !front; console.log(front, constraints)};
  
  var constraints = { video: { facingMode: (front? "user" : "environment") } };

  navigator.mediaDevices.getUserMedia(constraints)
      .then(handleSuccess)
     /* .catch(err => {
        console.log('Error =====> ', err);

      });*/