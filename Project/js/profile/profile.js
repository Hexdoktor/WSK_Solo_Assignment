import {getCurrentUser} from '../auth/auth.js';

function getProfileKey() {
  const user = getCurrentUser();
  return user ? `userProfile_${user.username}` : null;
}

export function loadProfile() {
  const key = getProfileKey();
  if (!key) return;

  const data = JSON.parse(localStorage.getItem(key)) || {};

  if (data.name) document.getElementById('profileName').value = data.name;
  if (data.city) document.getElementById('profileCity').value = data.city;
  if (data.image) document.getElementById('profileImage').src = data.image;
}

export function saveProfile() {
  const key = getProfileKey();
  if (!key) return;

  const name = document.getElementById('profileName').value.trim();
  const city = document.getElementById('profileCity').value.trim();
  const image = document.getElementById('profileImage').src;

  const profile = {name, city, image};
  localStorage.setItem(key, JSON.stringify(profile));
}

export function setupProfileEvents() {
  const uploadInput = document.getElementById('profileImageUpload');
  const saveBtn = document.getElementById('saveProfileBtn');

  if (uploadInput) {
    uploadInput.addEventListener('change', () => {
      const file = uploadInput.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        document.getElementById('profileImage').src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      saveProfile();
    });
  }
}
