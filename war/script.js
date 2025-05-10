function fire(side, type) {
  const wrapper = document.createElement("div");
  const img = document.createElement("img");

  wrapper.classList.add("projectile");

  if (type === "bullet") {
    img.src = "./images/bullet.png";
    wrapper.style.width = "40px";
  } else {
    img.src = "./images/missile.png";
    wrapper.style.width = "100px";
  }

  img.style.width = "100%";
  img.style.height = "auto";

  // Set vertical position
  const y = Math.random() * (window.innerHeight - 50);
  wrapper.style.top = `${y}px`;

  // Set horizontal starting position
  wrapper.style.left =
    side === "left" ? "100px" : window.innerWidth - 100 + "px";

  // Flip image if from right
  if (side === "right") {
    img.style.transform = "scaleX(-1)";
  }

  wrapper.appendChild(img);

  // Animate
  if (type === "bullet") {
    wrapper.style.animation =
      side === "left"
        ? "fireBulletRight 2s linear forwards"
        : "fireBulletLeft 2s linear forwards";
  } else {
    wrapper.style.animation =
      side === "left"
        ? "fireMissileLeft 2s linear forwards"
        : "fireMissileRight 2s linear forwards";
  }

  document.body.appendChild(wrapper);

  setTimeout(() => wrapper.remove(), 2200);
}
