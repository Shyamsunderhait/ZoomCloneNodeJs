// const socket = io("/");
// const videoGrid = document.getElementById("video-grid");

// const myVideo = document.createElement("video");
// myVideo.muted = true;

// var peer = new Peer(undefined, {
//   path: "/peerjs",
//   host: "/",
//   port: "3030",
// });

// let myVideoStream;
// //getUserMedia = it accepts an object
// navigator.mediaDevices
//   .getUserMedia({
//     video: true,
//     audio: true,
//   })
//   .then((stream) => {
//     myVideoStream = stream;
//     addVideoStream(myVideo, stream);

//     peer.on("call", (call) => {
//       call.answer(stream);
//       const video = document.createElement("video");
//       call.on("stream", (userVideoStream) => {
//         addVideoStream(video, userVideoStream);
//       });
//     });

//     socket.on("user-connected", (userId) => {
//       connecToNewUser(userId, stream);
//     });
//   })
//   .catch((error) => {
//     console.error("error accessing media", error);
//   });

// peer.on("open", (id) => {
//   socket.emit("join-room", ROOM_ID, id);
// });

// const connecToNewUser = (userId, stream) => {
//   const call = peer.call(userId, stream);
//   const video = document.createElement("video");
//   call.on("stream", (userVideoStream) => {
//     addVideoStream(video, userVideoStream);
//   });
// };

// const addVideoStream = (video, stream) => {
//   video.srcObject = stream;
//   video.addEventListener("loadedmetadata", () => {
//     video.play();
//   });
//   videoGrid.append(video);
// };
const socket = io("/");
const videoGrid = document.getElementById("video-grid");

const myVideo = document.createElement("video");
myVideo.muted = true;

var peer = new Peer(undefined, {
  path: "/peerjs",
  host: "/",
  port: "3030",
});

let myVideoStream;

navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    peer.on("call", (call) => {
      console.log("Receiving a call...");
      call.answer(stream);
      const video = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        console.log("Adding user video stream...");
        addVideoStream(video, userVideoStream);
      });
      call.on("error", (err) => {
        console.error("Call error:", err);
      });
    });

    socket.on("user-connected", (userId) => {
      console.log("User connected:", userId);
      connectToNewUser(userId, stream);
    });
  })
  .catch((error) => {
    console.error("Error accessing media:", error);
  });

peer.on("open", (id) => {
  console.log("PeerJS connection opened with ID:", id);
  socket.emit("join-room", ROOM_ID, id);
});

peer.on("error", (err) => {
  console.error("PeerJS error:", err);
});

const connectToNewUser = (userId, stream) => {
  console.log("Calling new user:", userId);
  const call = peer.call(userId, stream);
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    console.log("Adding new user's video stream...");
    addVideoStream(video, userVideoStream);
  });
  call.on("error", (err) => {
    console.error("Call error:", err);
  });
};

const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.append(video);
  console.log("Video stream added to grid");
};

let msg = $("input");
console.log(msg);

$("html").keydown((e) => {
  if (e.which == 13 && text.val().length !== 0) {
    socket.emit("message".text.val());
    text.val("");
  }
});
