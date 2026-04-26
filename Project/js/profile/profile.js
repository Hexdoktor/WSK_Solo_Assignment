const PROFILE_KEY = 'userProfile';

export function loadProfile() {
  const data = JSON.parse(localStorage.getItem(PROFILE_KEY)) || {};

  if (data.name) document.getElementById('profileName').value = data.name;
  if (data.city) document.getElementById('profileCity').value = data.city;
  if (data.image) document.getElementById('profileImage').src = data.image;
}

export function saveProfile() {
  const name = document.getElementById('profileName').value.trim();
  const city = document.getElementById('profileCity').value.trim();
  const image = document.getElementById('profileImage').src;

  const profile = {name, city, image};
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function setupProfileEvents() {
  const uploadInput = document.getElementById('profileImageUpload');
  const saveBtn = document.getElementById('saveProfileBtn');

  uploadInput.addEventListener('change', () => {
    const file = uploadInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      document.getElementById('profileImage').src = reader.result;
    };
    reader.readAsDataURL(file);
  });

  saveBtn.addEventListener('click', () => {
    saveProfile();
  });
}
