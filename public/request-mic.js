const captureUserMedia = async (callback) => {
  await navigator.mediaDevices
    .getUserMedia({ audio: true, video: false })
    .then(() => {
      window.close()
      callback()
    })
    .catch((err) => {
      console.log(err);
    });
};

captureUserMedia();
