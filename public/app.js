(() => {
  const viewNames = ["scanner", "dashboard", "recommendations", "simulator"];
  let webcamStream = null;
  let currentPhotoUrl = null;
  let toastTimeout = null;

  function getElement(id) {
    const element = document.getElementById(id);
    if (!element) {
      throw new Error(`Expected page element #${id} was not found.`);
    }
    return element;
  }

  window.switchView = function (viewName) {
    if (!viewNames.includes(viewName)) {
      throw new Error(`Unknown page view: ${viewName}`);
    }

    viewNames.forEach((name) => {
      const view = document.getElementById(`view-${name}`);
      const nav = document.getElementById(`nav-${name}`);
      if (view) view.classList.add("hidden");
      if (nav) {
        nav.classList.remove("text-cyan-400");
        nav.classList.add("text-slate-400");
      }
    });

    getElement(`view-${viewName}`).classList.remove("hidden");
    const activeNav = document.getElementById(`nav-${viewName}`);
    if (activeNav) {
      activeNav.classList.remove("text-slate-400");
      activeNav.classList.add("text-cyan-400");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  window.toggleMobileMenu = function () {
    getElement("mobile-menu").classList.toggle("hidden");
  };

  window.triggerQuickScanModal = function () {
    window.switchView("scanner");
    window.setTimeout(window.startFullScan, 0);
  };

  window.startFullScan = function () {
    const button = getElement("btn-start-scan");
    if (button.disabled) return;

    const laser = getElement("laser-line");
    const progressBox = getElement("scan-progress-box");
    const percent = getElement("scan-percent");
    const stepMessage = getElement("scan-step-msg");
    const status = getElement("scan-status-text");
    const steps = [
      { at: 20, msg: "Mapping Facial Geometry..." },
      { at: 45, msg: "Detecting Hair Curl Pattern & Density..." },
      { at: 75, msg: "Analyzing Crown & Skull Symmetry..." },
      { at: 92, msg: "Generating Demo Recommendation Matrix..." },
    ];
    let progress = 0;

    button.disabled = true;
    laser.classList.remove("hidden");
    progressBox.classList.remove("hidden");
    status.innerText = "RUNNING DEMO SCAN...";
    stepMessage.innerText = "Initializing demo scan...";

    const interval = window.setInterval(() => {
      progress = Math.min(progress + 2, 100);
      percent.innerText = `${progress}%`;

      const currentStep = steps.filter((step) => progress >= step.at).pop();
      if (currentStep) stepMessage.innerText = currentStep.msg;

      if (progress >= 100) {
        window.clearInterval(interval);
        laser.classList.add("hidden");
        progressBox.classList.add("hidden");
        button.disabled = false;
        status.innerText = "DEMO COMPLETE";
        window.showToast(
          "Demo Scan Complete",
          "This prototype uses sample analysis, not AI."
        );
        window.setTimeout(() => window.switchView("dashboard"), 800);
      }
    }, 40);
  };

  window.handlePhotoUpload = function (event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      window.showToast("Unsupported File", "Choose an image file to preview.");
      event.target.value = "";
      return;
    }

    if (currentPhotoUrl) URL.revokeObjectURL(currentPhotoUrl);
    currentPhotoUrl = URL.createObjectURL(file);
    getElement("scanner-preview-container").style.backgroundImage =
      `url("${currentPhotoUrl}")`;
    getElement("simulator-bg").style.backgroundImage =
      `url("${currentPhotoUrl}")`;
    window.showToast(
      "Photo Preview Ready",
      "The image stays in this browser; no analysis is performed."
    );
    window.setTimeout(() => window.switchView("dashboard"), 700);
  };

  window.filterHaircuts = function (category) {
    const categories = ["all", "short", "textured", "long"];
    if (!categories.includes(category)) {
      throw new Error(`Unknown haircut category: ${category}`);
    }

    categories.forEach((name) => {
      const button = document.getElementById(`filter-${name}`);
      if (button) {
        button.className =
          "px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition";
      }
    });

    const activeButton = document.getElementById(`filter-${category}`);
    if (activeButton) {
      activeButton.className =
        "px-3.5 py-1.5 rounded-lg bg-cyan-500 text-black font-semibold text-xs transition";
    }

    document.querySelectorAll("#haircuts-grid > div").forEach((card) => {
      card.style.display =
        category === "all" || card.getAttribute("data-category") === category
          ? "flex"
          : "none";
    });
  };

  window.openTryOnSimulator = function (cutName, imageUrl) {
    window.switchView("simulator");
    window.switchTryOnStyle(cutName, imageUrl);
  };

  window.switchTryOnStyle = function (cutName, imageUrl) {
    getElement("current-active-style").innerText = cutName;
    getElement("haircut-overlay").style.backgroundImage = `url("${imageUrl}")`;
    window.showToast("Demo Style Loaded", `Previewing ${cutName}.`);
  };

  window.updateHeadRotation = function (value) {
    getElement("rotation-val").innerText = `${value}°`;
    getElement("simulator-bg").style.filter = `hue-rotate(${value * 0.2}deg)`;
  };

  window.toggleCameraFeed = async function () {
    const text = getElement("cam-toggle-text");
    const background = getElement("simulator-bg");

    if (webcamStream) {
      webcamStream.getTracks().forEach((track) => track.stop());
      webcamStream = null;
      const video = document.getElementById("simulator-camera");
      if (video) video.remove();
      text.innerText = "Enable Webcam";
      window.showToast("Webcam Disabled", "Returned to the sample preview.");
      return;
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      window.showToast(
        "Camera Unavailable",
        "Use HTTPS or localhost in a browser that supports camera access."
      );
      return;
    }

    try {
      webcamStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      const video = document.createElement("video");
      video.id = "simulator-camera";
      video.autoplay = true;
      video.playsInline = true;
      video.muted = true;
      video.className = "absolute inset-0 h-full w-full object-cover";
      video.srcObject = webcamStream;
      background.prepend(video);
      text.innerText = "Disable Webcam";
      window.showToast("Webcam Enabled", "Your live video stays in this browser.");
    } catch (error) {
      webcamStream = null;
      const reason =
        error && error.name === "NotAllowedError"
          ? "Allow camera access in your browser to continue."
          : "Check that a camera is connected and available.";
      window.showToast("Could Not Start Webcam", reason);
    }
  };

  window.triggerSnapshot = function () {
    const video = document.getElementById("simulator-camera");
    if (!webcamStream || !video || !video.videoWidth) {
      window.showToast(
        "Webcam Required",
        "Enable the webcam before capturing a snapshot."
      );
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      if (!blob) {
        window.showToast("Snapshot Failed", "The browser could not export it.");
        return;
      }

      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "headsnap-webcam-snapshot.png";
      link.click();
      URL.revokeObjectURL(downloadUrl);
      window.showToast("Snapshot Downloaded", "Saved a webcam image as PNG.");
    }, "image/png");
  };

  window.openBarberCard = function (cutName) {
    getElement("modal-cut-title").innerText = cutName;
    getElement("barber-modal").classList.remove("hidden");
  };

  window.closeBarberCard = function () {
    getElement("barber-modal").classList.add("hidden");
  };

  window.simulateCopySuccess = async function () {
    const instructions = [
      `Style: ${getElement("modal-cut-title").innerText}`,
      "Face shape: Oval / Diamond",
      "Hair texture: Wavy (2B) / Thick density",
      "Sides and back: Mid skin fade, blended at the occipital ridge",
      "Top: Point cut to 2.5 inches, textured forward",
    ].join("\n");

    try {
      await navigator.clipboard.writeText(instructions);
      window.showToast("Copied to Clipboard", "Barber instructions are ready.");
      window.closeBarberCard();
    } catch (error) {
      window.showToast(
        "Clipboard Unavailable",
        "Allow clipboard access or use a secure HTTPS connection."
      );
    }
  };

  window.showToast = function (title, message) {
    const toast = getElement("toast");
    getElement("toast-title").innerText = title;
    getElement("toast-msg").innerText = message;
    toast.classList.remove("translate-y-24", "opacity-0");
    if (toastTimeout) window.clearTimeout(toastTimeout);
    toastTimeout = window.setTimeout(() => {
      toast.classList.add("translate-y-24", "opacity-0");
    }, 3500);
  };
})();
