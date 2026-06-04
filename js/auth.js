const API_URL = window.location.origin.startsWith('http') ? window.location.origin : 'http://localhost:3000';
let authMode = 'login'; // 'login' or 'register'

document.addEventListener('DOMContentLoaded', () => {
  initAuth();
});

function initAuth() {
  createLoginModal();
  checkLoginStatus();
  setupEventListeners();
  bindNavigation();
  initCart();
}

function createLoginModal() {
  const modalHtml = `
    <div id="login-modal" class="fixed inset-0 z-[100] hidden items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300">
      <div class="bg-surface-bright w-11/12 max-w-lg rounded-2xl p-lg shadow-xl border border-outline-variant transform scale-95 transition-transform duration-300">
        <div class="flex justify-between items-center mb-md">
          <h3 id="modal-title" class="font-headline-md text-headline-md text-on-surface font-bold">AllergyFree 로그인</h3>
          <button id="close-login-modal" class="text-outline hover:text-on-surface flex items-center justify-center p-1 rounded-full hover:bg-surface-container-high transition-colors">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <div id="test-account-tip" class="mb-md bg-surface-container-low p-sm rounded-lg border border-outline-variant">
          <p class="text-body-sm text-on-surface-variant font-medium">💡 테스트용 로봇 계정 정보</p>
          <p class="text-label-sm text-outline mt-1">아이디: <code class="text-primary font-bold">robot</code> 또는 이메일: <code class="text-primary font-bold">robot@allergyfree.com</code></p>
          <p class="text-label-sm text-outline">비밀번호: <code class="text-primary font-bold">password123</code></p>
        </div>

        <form id="login-form" class="space-y-md">
          <!-- 1. Login Fields -->
          <div id="login-only-fields" class="space-y-md">
            <div>
              <label class="block text-label-lg text-on-surface-variant mb-xs font-semibold font-body-sm">이메일 주소 또는 아이디</label>
              <input type="text" id="login-email" value="robot@allergyfree.com" required
                class="w-full bg-surface-container-low border border-outline rounded-lg px-md py-sm text-body-md focus:ring-2 focus:ring-primary focus:outline-none transition-all"/>
            </div>
            <div>
              <label class="block text-label-lg text-on-surface-variant mb-xs font-semibold font-body-sm">비밀번호</label>
              <input type="password" id="login-password" value="password123" required
                class="w-full bg-surface-container-low border border-outline rounded-lg px-md py-sm text-body-md focus:ring-2 focus:ring-primary focus:outline-none transition-all"/>
            </div>
          </div>

          <!-- 2. Register Fields (Scrollable Container) -->
          <div id="register-only-fields" class="hidden space-y-md max-h-[350px] overflow-y-auto pr-2 border-t border-b border-outline-variant/30 py-md my-sm">
            <h4 class="text-label-lg text-primary font-bold">1. 계정 정보</h4>
            <div class="space-y-sm">
              <div>
                <label class="block text-label-sm text-on-surface-variant mb-xs font-semibold">아이디 (ID)</label>
                <input type="text" id="register-username" placeholder="로그인용 아이디 입력"
                  class="w-full bg-surface-container-low border border-outline rounded-lg px-md py-sm text-body-sm focus:ring-2 focus:ring-primary focus:outline-none transition-all"/>
              </div>
              <div>
                <label class="block text-label-sm text-on-surface-variant mb-xs font-semibold">비밀번호</label>
                <input type="password" id="register-password" placeholder="비밀번호 6자 이상"
                  class="w-full bg-surface-container-low border border-outline rounded-lg px-md py-sm text-body-sm focus:ring-2 focus:ring-primary focus:outline-none transition-all"/>
              </div>
              <div>
                <label class="block text-label-sm text-on-surface-variant mb-xs font-semibold">이름</label>
                <input type="text" id="register-name" placeholder="사용자 이름 입력"
                  class="w-full bg-surface-container-low border border-outline rounded-lg px-md py-sm text-body-sm focus:ring-2 focus:ring-primary focus:outline-none transition-all"/>
              </div>
              <div>
                <label class="block text-label-sm text-on-surface-variant mb-xs font-semibold">이메일 주소</label>
                <input type="email" id="register-email" placeholder="example@email.com"
                  class="w-full bg-surface-container-low border border-outline rounded-lg px-md py-sm text-body-sm focus:ring-2 focus:ring-primary focus:outline-none transition-all"/>
              </div>
              <div>
                <label class="block text-label-sm text-on-surface-variant mb-xs font-semibold">휴대전화 번호</label>
                <input type="tel" id="register-phone" placeholder="010-0000-0000"
                  class="w-full bg-surface-container-low border border-outline rounded-lg px-md py-sm text-body-sm focus:ring-2 focus:ring-primary focus:outline-none transition-all"/>
              </div>
              <div class="grid grid-cols-2 gap-sm">
                <div>
                  <label class="block text-label-sm text-on-surface-variant mb-xs font-semibold">생년월일 (선택)</label>
                  <input type="date" id="register-birthdate"
                    class="w-full bg-surface-container-low border border-outline rounded-lg px-md py-sm text-body-sm focus:ring-2 focus:ring-primary focus:outline-none transition-all"/>
                </div>
                <div>
                  <label class="block text-label-sm text-on-surface-variant mb-xs font-semibold">성별 (선택)</label>
                  <select id="register-gender"
                    class="w-full bg-surface-container-low border border-outline rounded-lg px-md py-sm text-body-sm focus:ring-2 focus:ring-primary focus:outline-none transition-all">
                    <option value="">선택 안함</option>
                    <option value="male">남성</option>
                    <option value="female">여성</option>
                    <option value="other">기타</option>
                  </select>
                </div>
              </div>
            </div>

            <h4 class="text-label-lg text-primary font-bold pt-sm">2. 배송 정보</h4>
            <div class="space-y-sm">
              <div>
                <label class="block text-label-sm text-on-surface-variant mb-xs font-semibold">수령인 이름 (기본값: 이름)</label>
                <input type="text" id="register-recipient-name" placeholder="수령인 이름 입력"
                  class="w-full bg-surface-container-low border border-outline rounded-lg px-md py-sm text-body-sm focus:ring-2 focus:ring-primary focus:outline-none transition-all"/>
              </div>
              <div class="grid grid-cols-3 gap-xs">
                <div class="col-span-2">
                  <label class="block text-label-sm text-on-surface-variant mb-xs font-semibold">우편번호</label>
                  <input type="text" id="register-zipcode" placeholder="우편번호"
                    class="w-full bg-surface-container-low border border-outline rounded-lg px-md py-sm text-body-sm focus:ring-2 focus:ring-primary focus:outline-none transition-all"/>
                </div>
                <div class="flex items-end">
                  <button type="button" onclick="alert('임의의 주소를 직접 입력해주세요.')"
                    class="w-full bg-secondary-container text-on-secondary-container py-2 text-label-sm font-semibold rounded-lg hover:bg-opacity-90 active:scale-95 transition-all">
                    주소 검색
                  </button>
                </div>
              </div>
              <div>
                <label class="block text-label-sm text-on-surface-variant mb-xs font-semibold">배송지 주소</label>
                <input type="text" id="register-address" placeholder="기본 주소 입력"
                  class="w-full bg-surface-container-low border border-outline rounded-lg px-md py-sm text-body-sm focus:ring-2 focus:ring-primary focus:outline-none transition-all"/>
              </div>
              <div>
                <label class="block text-label-sm text-on-surface-variant mb-xs font-semibold">상세 주소</label>
                <input type="text" id="register-detail-address" placeholder="상세 주소 입력"
                  class="w-full bg-surface-container-low border border-outline rounded-lg px-md py-sm text-body-sm focus:ring-2 focus:ring-primary focus:outline-none transition-all"/>
              </div>
              <div>
                <label class="block text-label-sm text-on-surface-variant mb-xs font-semibold">연락처</label>
                <input type="tel" id="register-contact-phone" placeholder="배송 연락처"
                  class="w-full bg-surface-container-low border border-outline rounded-lg px-md py-sm text-body-sm focus:ring-2 focus:ring-primary focus:outline-none transition-all"/>
              </div>
            </div>
          </div>

          <div id="login-error" class="text-error text-body-sm hidden bg-error-container/35 p-xs rounded border border-error/20"></div>
          
          <div class="flex gap-sm pt-sm">
            <button type="button" id="cancel-login-modal"
              class="flex-1 bg-surface-container-high text-on-surface py-sm rounded-lg font-label-lg hover:bg-opacity-90 active:scale-95 transition-all">
              취소
            </button>
            <button type="submit" id="submit-btn"
              class="flex-1 bg-primary text-on-primary py-sm rounded-lg font-label-lg hover:bg-opacity-90 active:scale-95 transition-all">
              로그인
            </button>
          </div>
        </form>

        <div class="mt-md text-center border-t border-outline-variant/30 pt-md">
          <p class="text-body-sm text-on-surface-variant">
            <span id="toggle-mode-text">계정이 없으신가요?</span>
            <button id="toggle-auth-mode" class="text-primary font-bold hover:underline ml-1">회원가입</button>
          </p>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function setupEventListeners() {
  const loginModal = document.getElementById('login-modal');
  const closeBtn = document.getElementById('close-login-modal');
  const cancelBtn = document.getElementById('cancel-login-modal');
  const loginForm = document.getElementById('login-form');
  const toggleModeBtn = document.getElementById('toggle-auth-mode');
  
  bindProfileClicks();

  closeBtn.addEventListener('click', closeModal);
  if (cancelBtn) {
    cancelBtn.addEventListener('click', closeModal);
  }
  
  loginModal.addEventListener('click', (e) => {
    if (e.target === loginModal) closeModal();
  });

  // Toggle auth mode (Login / Register)
  toggleModeBtn.addEventListener('click', () => {
    const modalTitle = document.getElementById('modal-title');
    const submitBtn = document.getElementById('submit-btn');
    const toggleText = document.getElementById('toggle-mode-text');
    const testTip = document.getElementById('test-account-tip');
    const errorDiv = document.getElementById('login-error');
    const loginFields = document.getElementById('login-only-fields');
    const registerFields = document.getElementById('register-only-fields');
    
    errorDiv.classList.add('hidden');
    
    if (authMode === 'login') {
      authMode = 'register';
      modalTitle.innerText = 'AllergyFree 회원가입';
      submitBtn.innerText = '회원가입';
      toggleText.innerText = '이미 계정이 있으신가요?';
      toggleModeBtn.innerText = '로그인';
      testTip.classList.add('hidden');
      
      loginFields.classList.add('hidden');
      registerFields.classList.remove('hidden');

      // Add required markers
      document.getElementById('login-email').removeAttribute('required');
      document.getElementById('login-password').removeAttribute('required');
      
      document.getElementById('register-username').setAttribute('required', 'true');
      document.getElementById('register-password').setAttribute('required', 'true');
      document.getElementById('register-name').setAttribute('required', 'true');
      document.getElementById('register-email').setAttribute('required', 'true');
      document.getElementById('register-phone').setAttribute('required', 'true');
    } else {
      authMode = 'login';
      modalTitle.innerText = 'AllergyFree 로그인';
      submitBtn.innerText = '로그인';
      toggleText.innerText = '계정이 없으신가요?';
      toggleModeBtn.innerText = '회원가입';
      testTip.classList.remove('hidden');
      
      loginFields.classList.remove('hidden');
      registerFields.classList.add('hidden');

      // Restore required markers
      document.getElementById('login-email').setAttribute('required', 'true');
      document.getElementById('login-password').setAttribute('required', 'true');
      
      document.getElementById('register-username').removeAttribute('required');
      document.getElementById('register-password').removeAttribute('required');
      document.getElementById('register-name').removeAttribute('required');
      document.getElementById('register-email').removeAttribute('required');
      document.getElementById('register-phone').removeAttribute('required');
      
      document.getElementById('login-email').value = 'robot@allergyfree.com';
      document.getElementById('login-password').value = 'password123';
    }
  });

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const errorDiv = document.getElementById('login-error');
    errorDiv.classList.add('hidden');

    let bodyData = {};
    const endpoint = authMode === 'login' ? '/auth/login' : '/auth/register';

    if (authMode === 'login') {
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;
      bodyData = { email, password };
    } else {
      const email = document.getElementById('register-email').value;
      const username = document.getElementById('register-username').value;
      const password = document.getElementById('register-password').value;
      const name = document.getElementById('register-name').value;
      const phone = document.getElementById('register-phone').value;
      const birthdate = document.getElementById('register-birthdate').value || undefined;
      const gender = document.getElementById('register-gender').value || undefined;
      const recipient_name = document.getElementById('register-recipient-name').value || name; // Default to name
      const address = document.getElementById('register-address').value || undefined;
      const detail_address = document.getElementById('register-detail-address').value || undefined;
      const zipcode = document.getElementById('register-zipcode').value || undefined;
      const contact_phone = document.getElementById('register-contact-phone').value || phone; // Default to phone

      bodyData = {
        email, username, password, name, phone,
        birthdate, gender, recipient_name, address,
        detail_address, zipcode, contact_phone
      };
    }

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || '요청 처리에 실패했습니다.');
      }

      localStorage.setItem('token', data.access_token);
      closeModal();
      checkLoginStatus();
      
      if (authMode === 'register') {
        alert('회원가입 및 로그인이 완료되었습니다!');
      }
    } catch (err) {
      errorDiv.innerText = err.message;
      errorDiv.classList.remove('hidden');
    }
  });

  // Bind homepage search input
  const searchInput = document.querySelector('input[placeholder="상품명 또는 바코드 검색"]');
  const searchIcon = document.querySelector('span[data-icon="search"]');
  if (searchInput) {
    const handleSearch = () => {
      const query = searchInput.value.trim();
      if (!query) return;
      if (/^\d+$/.test(query)) {
        window.location.href = `/scan?barcode=${query}`;
      } else {
        if (window.location.pathname.includes('/shop') && !window.location.pathname.includes('/shop_food')) {
          // Already on shop page, update URL search params and filter cards
          const url = new URL(window.location.href);
          url.searchParams.set('search', query);
          window.history.replaceState({}, '', url.toString());
          
          const cards = document.querySelectorAll('.product-card');
          const cleanQuery = query.toLowerCase();
          cards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const brand = card.querySelector('span.text-label-sm').textContent.toLowerCase();
            if (title.includes(cleanQuery) || brand.includes(cleanQuery)) {
              card.style.display = '';
            } else {
              card.style.display = 'none';
            }
          });
        } else {
          window.location.href = `/shop?search=${encodeURIComponent(query)}`;
        }
      }
    };
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleSearch();
    });
    if (searchIcon) {
      searchIcon.style.cursor = 'pointer';
      searchIcon.addEventListener('click', handleSearch);
    }
  }

  // Bind Floating Action Button (FAB) for scanning
  const scanFab = Array.from(document.querySelectorAll('button')).find(btn => 
    btn.querySelector('span[data-icon="barcode_scanner"]') || btn.querySelector('span[data-icon="scan"]')
  );
  if (scanFab) {
    scanFab.style.cursor = 'pointer';
    scanFab.addEventListener('click', () => {
      const barcode = prompt("스캔할 바코드를 입력하세요 (예: 8801111111111 - 초코우유, 8802222222222 - 땅콩샌드, 8803333333333 - 통밀식빵):", "8801111111111");
      if (barcode) {
        window.location.href = `/scan?barcode=${barcode}`;
      } else if (barcode !== null) {
        window.location.href = '/scan';
      }
    });
  }
}

function bindProfileClicks() {
  const handleProfileClick = (e) => {
    e.preventDefault();
    if (localStorage.getItem('token')) {
      if (confirm('로그아웃 하시겠습니까?')) {
        logout();
      }
    } else {
      openModal();
    }
  };

  // Direct binding by ID (Foolproof)
  const profileBtn = document.getElementById('header-profile-btn');
  if (profileBtn) {
    profileBtn.style.cursor = 'pointer';
    profileBtn.addEventListener('click', handleProfileClick);
  }

  // Fallback scan for other profile elements (e.g., icons, bottom navigation, text)
  const profileIcons = Array.from(document.querySelectorAll('.material-symbols-outlined')).filter(el => 
    el.textContent.trim() === 'account_circle' || 
    el.getAttribute('data-icon') === 'account_circle' ||
    el.textContent.trim() === 'person' ||
    el.getAttribute('data-icon') === 'person' ||
    el.textContent.trim() === 'logout'
  );

  profileIcons.forEach(icon => {
    // If it's already inside header-profile-btn, we skip to avoid double triggers
    if (icon.closest('#header-profile-btn')) return;

    const labelSpan = icon.parentElement ? icon.parentElement.querySelector('.font-label-sm') : null;
    if (labelSpan && (labelSpan.textContent.trim().toLowerCase() === 'profile' || labelSpan.textContent.trim().toLowerCase() === 'logout')) {
      return;
    }
    
    const clickTarget = (icon.tagName === 'SPAN' && icon.parentElement && icon.parentElement.tagName.toUpperCase() === 'BUTTON') ? icon.parentElement : icon;
    clickTarget.style.cursor = 'pointer';
    clickTarget.addEventListener('click', handleProfileClick);
  });
}

function openModal() {
  const modal = document.getElementById('login-modal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeModal() {
  const modal = document.getElementById('login-modal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
  const errorDiv = document.getElementById('login-error');
  if (errorDiv) errorDiv.classList.add('hidden');
}

async function checkLoginStatus() {
  const token = localStorage.getItem('token');
  
  if (!token) {
    updateHeroGreeting(null, null);
    updateProfileButtonState(false);
    triggerPageSpecificInit([]);
    return;
  }

  try {
    const response = await fetch(`${API_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error('Token expired or invalid');
    }

    const userData = await response.json();
    const displayName = userData.name || userData.email.split('@')[0];
    const allergyList = userData.allergies.map(a => a.display_name).join(', ') || '없음';

    updateHeroGreeting(displayName, allergyList);
    updateProfileButtonState(true, userData.email);

    const userAllergyNames = userData.allergies.map(a => a.display_name);
    triggerPageSpecificInit(userAllergyNames, userData);
  } catch (err) {
    console.error('Auth verification failed:', err);
    logout();
    triggerPageSpecificInit([], null);
  }
}

function updateHeroGreeting(name, allergies) {
  const welcomeTitle = document.querySelector('main section h1');
  const welcomeText = document.querySelector('main section p');
  const editAllergyBtns = Array.from(document.querySelectorAll('button')).filter(btn => 
    btn.textContent.includes('알러지 정보 수정')
  );
  
  if (welcomeTitle && welcomeText) {
    if (name) {
      welcomeTitle.innerText = `안녕하세요, ${name} 님`;
      welcomeText.innerHTML = `현재 <span class="text-error font-bold underline underline-offset-4 decoration-2">${allergies}</span> 알러지가 설정되어 있습니다. 오늘도 안전한 식사를 도와드릴게요.`;
      editAllergyBtns.forEach(btn => btn.classList.remove('hidden'));
    } else {
      welcomeTitle.innerText = `안녕하세요!`;
      welcomeText.innerHTML = `로그인하고 나만의 알러지 정보를 관리해보세요. 개인 맞춤 식단을 위해 로그인해주세요.`;
      editAllergyBtns.forEach(btn => btn.classList.add('hidden'));
    }
  }
}

function updateProfileButtonState(isLoggedIn, email = '') {
  const profileIcons = Array.from(document.querySelectorAll('.material-symbols-outlined')).filter(el => 
    el.textContent.trim() === 'account_circle' || 
    el.getAttribute('data-icon') === 'account_circle' ||
    el.textContent.trim() === 'logout'
  );

  profileIcons.forEach(icon => {
    const labelSpan = icon.parentElement.querySelector('.font-label-sm');
    if (labelSpan && (labelSpan.textContent.trim().toLowerCase() === 'profile' || labelSpan.textContent.trim().toLowerCase() === 'logout')) {
      return;
    }
    
    if (isLoggedIn) {
      icon.textContent = 'logout';
      icon.title = `${email} (클릭하여 로그아웃)`;
      icon.classList.add('text-primary');
    } else {
      icon.textContent = 'account_circle';
      icon.title = '로그인';
      icon.classList.remove('text-primary');
    }
  });
  


  // Toggle bottom nav bar visibility on desktop depending on login state
  const bottomNav = document.querySelector('nav.fixed.bottom-0');
  if (bottomNav) {
    if (isLoggedIn) {
      bottomNav.classList.remove('md:hidden');
    } else {
      bottomNav.classList.add('md:hidden');
    }
  }
}

function logout() {
  localStorage.removeItem('token');
  checkLoginStatus();
}

function bindNavigation() {
  // Bind Logo click
  const logoElements = Array.from(document.querySelectorAll('header span, header h1, header div')).filter(el => 
    el.textContent.trim() === 'AllergyFree'
  );
  logoElements.forEach(logo => {
    logo.style.cursor = 'pointer';
    logo.addEventListener('click', () => {
      window.location.href = '/';
    });
  });

  // Bind Back arrow if it exists
  const backArrow = document.querySelector('header span[data-icon="arrow_back"]') || 
                    Array.from(document.querySelectorAll('header span')).find(el => el.textContent.trim() === 'arrow_back');
  if (backArrow) {
    backArrow.style.cursor = 'pointer';
    backArrow.addEventListener('click', () => {
      window.history.back();
    });
  }

  // Bind Desktop Nav links
  const desktopLinks = document.querySelectorAll('header nav a');
  desktopLinks.forEach(link => {
    const linkText = link.textContent.trim().toLowerCase();
    if (linkText === 'shop') {
      link.href = '/shop';
    } else if (linkText === 'scan') {
      link.href = '/scan';
    } else if (linkText === 'my pantry') {
      link.href = '/';
    }
  });

  // Bind Mobile Bottom Nav divs
  const navDivs = document.querySelectorAll('nav div');
  navDivs.forEach(div => {
    const labelSpan = div.querySelector('span:not(.material-symbols-outlined)');
    if (labelSpan) {
      const labelText = labelSpan.textContent.trim().toLowerCase();
      if (labelText === 'shop') {
        div.style.cursor = 'pointer';
        div.addEventListener('click', (e) => {
          e.preventDefault();
          window.location.href = '/shop';
        });
      } else if (labelText === 'scan') {
        div.style.cursor = 'pointer';
        div.addEventListener('click', (e) => {
          e.preventDefault();
          window.location.href = '/scan';
        });
      } else if (labelText === 'my pantry') {
        div.style.cursor = 'pointer';
        div.addEventListener('click', (e) => {
          e.preventDefault();
          window.location.href = '/';
        });
      } else if (labelText === 'profile' || labelText === 'logout') {
        div.style.cursor = 'pointer';
        div.addEventListener('click', (e) => {
          e.preventDefault();
          if (localStorage.getItem('token')) {
            window.location.href = '/profile';
          } else {
            openModal();
          }
        });
      }
    }
  });

  // Bind "알러지 정보 수정" button on homepage
  const editAllergyBtns = Array.from(document.querySelectorAll('button')).filter(btn => 
    btn.textContent.includes('알러지 정보 수정')
  );
  editAllergyBtns.forEach(btn => {
    btn.style.cursor = 'pointer';
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (localStorage.getItem('token')) {
        window.location.href = '/profile';
      } else {
        openModal();
      }
    });
  });
}

// =========================================================================
// Page Specific Initializations
// =========================================================================

const STANDARD_ALLERGENS = [
  '난류(계란)', '우유', '메밀', '땅콩', '대두', '밀',
  '새우', '게', '오징어', '고등어', '조개류 (굴, 전복, 홍합 등)',
  '쇠고기', '돼지고기', '닭고기',
  '호두', '잣', '복숭아', '토마토', '키위', '아황산류 (보존제)'
];

function triggerPageSpecificInit(userAllergies = [], userData = null) {
  const path = window.location.pathname;
  if (path.includes('/profile_edit') || path.includes('/pages/profile_edit.html')) {
    initProfileEditPage(userData);
  } else if (path.includes('/profile') || path.includes('/pages/profile.html')) {
    initProfilePage(userAllergies, userData);
  } else if (path.includes('/shop') && !path.includes('/shop_food')) {
    initShopPage(userAllergies);
  } else if (path.includes('/shop_food') || path.includes('/pages/shop_food.html')) {
    initShopFoodPage(userAllergies);
  } else if (path.includes('/scan') || path.includes('/pages/bacode_done.html')) {
    initScanPage(userAllergies);
  } else if (path.includes('/cart') || path.includes('/pages/cart.html')) {
    initCartPage(userAllergies);
  } else if (path === '/' || path.includes('/index.html') || path === '') {
    initHomePage(userAllergies);
  } else if (path.includes('/viewed_products') || path.includes('/pages/viewed_products.html')) {
    initViewedProductsPage(userAllergies);
  } else if (path.includes('/recipe') || path.includes('/pages/recipe.html')) {
    initRecipePage(userAllergies);
  } else if (path.includes('/map') || path.includes('/pages/map.html')) {
    if (typeof initMapPage === 'function') {
      try {
        initMapPage(userAllergies);
      } catch (mapErr) {
        console.error('Map initialization failed:', mapErr);
        alert('지도 로딩 중 에러가 발생했습니다: ' + mapErr.message);
      }
    }
  }
}

// 1. Profile Page Editor
let selectedAllergens = [];
let customAllergens = [];

function initProfilePage(userAllergies, userData = null) {
  // If not logged in, redirect to home page
  const token = localStorage.getItem('token');
  if (!token) {
    alert('로그인이 필요한 페이지입니다. 홈으로 이동합니다.');
    window.location.href = '/';
    return;
  }

  // Set initial selected allergens and custom allergens from backend
  const majorNames = [
    '난류(계란)', '우유', '메밀', '땅콩', '대두', '밀',
    '새우', '게', '오징어', '고등어', '조개류 (굴, 전복, 홍합 등)',
    '쇠고기', '돼지고기', '닭고기',
    '호두', '잣', '복숭아', '토마토', '키위', '아황산류 (보존제)',
    '계란', '견과류', '해산물' // backwards compatibility
  ];
  selectedAllergens = [];
  customAllergens = [];

  userAllergies.forEach(allergy => {
    let mapped = allergy;
    if (allergy === '계란') mapped = '난류(계란)';
    else if (allergy === '견과류') mapped = '호두';
    else if (allergy === '해산물') mapped = '새우';
    
    if (majorNames.includes(mapped)) {
      selectedAllergens.push(mapped);
    } else {
      customAllergens.push(mapped);
    }
  });

  // Update profile header names
  const nameEl = document.getElementById('profile-name');
  const avatarEl = document.getElementById('profile-avatar');
  if (nameEl && avatarEl && userData) {
    nameEl.innerText = `${userData.name || userData.username || '사용자'} 님`;
    avatarEl.innerText = (userData.name || userData.username || 'U').substring(0, 1).toUpperCase();
  }

  const editProfileBtn = document.getElementById('edit-profile-btn');
  if (editProfileBtn) {
    editProfileBtn.addEventListener('click', () => {
      window.location.href = '/profile_edit';
    });
  }

  renderMajorAllergens();
  renderCustomAllergens();
  setupProfileEventListeners();
}

function renderMajorAllergens() {
  const container = document.getElementById('major-allergens-grid');
  if (!container) return;

  container.innerHTML = '';
  container.className = "flex flex-col gap-lg w-full";

  const ALLERGEN_GROUPS = {
    '1. 기본 식품군': [
      { name: '난류(계란)', icon: 'egg' },
      { name: '우유', icon: 'water_drop' },
      { name: '메밀', icon: 'grain' },
      { name: '땅콩', icon: 'nutrition' },
      { name: '대두', icon: 'eco' },
      { name: '밀', icon: 'bakery_dining' }
    ],
    '2. 해산물': [
      { name: '새우', icon: 'restaurant_menu' },
      { name: '게', icon: 'restaurant_menu' },
      { name: '오징어', icon: 'set_meal' },
      { name: '고등어', icon: 'set_meal' },
      { name: '조개류 (굴, 전복, 홍합 등)', icon: 'set_meal' }
    ],
    '3. 육류': [
      { name: '쇠고기', icon: 'flatware' },
      { name: '돼지고기', icon: 'flatware' },
      { name: '닭고기', icon: 'flatware' }
    ],
    '4. 기타': [
      { name: '호두', icon: 'eco' },
      { name: '잣', icon: 'eco' },
      { name: '복숭아', icon: 'nature' },
      { name: '토마토', icon: 'nutrition' },
      { name: '키위', icon: 'eco' },
      { name: '아황산류 (보존제)', icon: 'science' }
    ]
  };

  Object.entries(ALLERGEN_GROUPS).forEach(([groupName, items]) => {
    const groupDiv = document.createElement('div');
    groupDiv.className = "space-y-xs";
    
    groupDiv.innerHTML = `<h4 class="font-headline-sm text-headline-sm text-on-surface-variant font-bold border-b border-outline-variant/30 pb-xs mb-sm mt-sm">${groupName}</h4>`;
    
    const grid = document.createElement('div');
    grid.className = "grid grid-cols-2 gap-md";
    
    items.forEach(item => {
      const isSelected = selectedAllergens.includes(item.name);
      const card = document.createElement('div');
      card.className = isSelected 
        ? "flex items-center gap-md p-md bg-surface-container-lowest rounded-xl border-2 border-primary shadow-sm cursor-pointer transition-all active:scale-95"
        : "flex items-center gap-md p-md bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm cursor-pointer hover:border-primary/50 transition-all active:scale-95";
      
      card.innerHTML = `
        <div class="w-10 h-10 rounded-lg ${isSelected ? 'bg-primary-container/20' : 'bg-surface-container'} flex items-center justify-center">
          <span class="material-symbols-outlined ${isSelected ? 'text-primary' : 'text-on-surface-variant'}" data-icon="${item.icon}">${item.icon}</span>
        </div>
        <span class="font-label-lg text-label-lg text-on-surface">${item.name}</span>
        ${isSelected ? `<span class="ml-auto material-symbols-outlined text-primary" data-icon="check_circle" style="font-variation-settings: 'FILL' 1;">check_circle</span>` : ''}
      `;

      card.addEventListener('click', () => {
        if (isSelected) {
          selectedAllergens = selectedAllergens.filter(x => x !== item.name);
        } else {
          selectedAllergens.push(item.name);
        }
        renderMajorAllergens();
      });

      grid.appendChild(card);
    });

    groupDiv.appendChild(grid);
    container.appendChild(groupDiv);
  });
}

function renderCustomAllergens() {
  const container = document.getElementById('custom-allergens-list');
  if (!container) return;

  container.innerHTML = '';
  if (customAllergens.length === 0) {
    container.innerHTML = `<p class="text-body-sm text-outline italic w-full">추가된 기타 알레르기가 없습니다.</p>`;
    return;
  }

  customAllergens.forEach(name => {
    const chip = document.createElement('div');
    chip.className = "flex items-center gap-xs bg-surface-container-high px-md py-sm rounded-full border border-outline-variant";
    chip.innerHTML = `
      <span class="font-label-sm text-label-sm text-on-surface">${name}</span>
      <span class="material-symbols-outlined text-[18px] cursor-pointer hover:text-error" data-icon="close">close</span>
    `;

    chip.querySelector('.material-symbols-outlined').addEventListener('click', () => {
      customAllergens = customAllergens.filter(x => x !== name);
      renderCustomAllergens();
    });

    container.appendChild(chip);
  });
}

function setupProfileEventListeners() {
  const addBtn = document.getElementById('add-custom-allergen-btn');
  const input = document.getElementById('custom-allergen-input');
  const saveBtn = document.getElementById('save-allergies-btn');
  const resetBtn = document.getElementById('reset-allergies-btn');

  if (addBtn && input) {
    // Remove existing event listeners to avoid duplicates
    const newAddBtn = addBtn.cloneNode(true);
    addBtn.parentNode.replaceChild(newAddBtn, addBtn);
    
    const addFn = () => {
      const val = input.value.trim();
      if (!val) return;
      if (selectedAllergens.includes(val) || customAllergens.includes(val)) {
        alert('이미 추가된 성분입니다.');
        return;
      }
      customAllergens.push(val);
      input.value = '';
      renderCustomAllergens();
    };

    newAddBtn.addEventListener('click', addFn);
    
    // Replace input to clear event listeners
    const newInput = input.cloneNode(true);
    input.parentNode.replaceChild(newInput, input);
    newInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') addFn();
    });
  }

  if (saveBtn) {
    const newSaveBtn = saveBtn.cloneNode(true);
    saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);
    
    newSaveBtn.addEventListener('click', async () => {
      const allAllergies = [...selectedAllergens, ...customAllergens];
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`${API_URL}/users/allergies`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ allergies: allAllergies })
        });

        if (!response.ok) {
          throw new Error('저장 실패');
        }

        alert('알레르기 설정이 성공적으로 저장되었습니다!');
        window.location.href = '/';
      } catch (err) {
        console.error(err);
        alert('설정 저장 중 오류가 발생했습니다.');
      }
    });
  }

  if (resetBtn) {
    const newResetBtn = resetBtn.cloneNode(true);
    resetBtn.parentNode.replaceChild(newResetBtn, resetBtn);
    
    newResetBtn.addEventListener('click', () => {
      if (confirm('모든 설정을 초기화하시겠습니까?')) {
        selectedAllergens = [];
        customAllergens = [];
        renderMajorAllergens();
        renderCustomAllergens();
      }
    });
  }
}

// Map backend category names to frontend filter values globally
function mapDbCategoryToFilter(dbCatName) {
  if (dbCatName === '간식') return '간식/과자';
  if (dbCatName === '음료') return '음료/대체음료';
  if (dbCatName === '유제품') return '유제품 대용';
  if (dbCatName === '베이커리') return '베이커리';
  return dbCatName;
}

// Helper to normalize product names and strip capacities globally
function extractBaseName(name) {
  if (!name) return '';
  return name
    // 1. Remove Unicode replacement character and corrupted parenthesized prefix (e.g. ())
    .replace(/[\uFFFD]/g, '')
    .replace(/\([^)]\)/g, '')
    .replace(/^u2502/g, '') // strip potential corrupted character residues
    .replace(/^㈜\S*\s*/gi, '')
    .replace(/^\(주\)\s*/gi, '')
    .replace(/^주\)\s*/gi, '')
    .replace(/^\(주\)\S+\s*/gi, '')
    .replace(/^\S+\)\s*/gi, '')
    .replace(/^\S+_\s*/gi, '')
    .replace(/^(서울우유|매일유업|남양유업|빙그레|동원|풀무원|삼립식품|삼립|샤니|오리온|롯데제과|롯데|농심|해태제과|해태|크라운제과|크라운|오뚜기|동아오츠카|삼육식품|삼육)\s*/gi, '')
    // 2. Remove capacity and unit metrics
    .replace(/\d+(\.\d+)?\s*(ml|g|l|ea|개|입|번들|봉|팩|p)\b/gi, '')
    .replace(/\b\d+(\.\d+)?\s*(밀리리터|그램|리터|개)\b/g, '')
    .replace(/\s*x\s*\d+\s*(ea|개|입)?/gi, '')
    .replace(/\s*\*\s*\d+/g, '')
    .replace(/\d+입/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// 2. Shop Page Evaluator
// 2. Shop Page Evaluator
async function initShopPage(userAllergies = []) {
  let activeAllergies = [...userAllergies];
  
  const gridContainer = document.getElementById('shop-product-grid');
  if (!gridContainer) return;

  const catAll = document.getElementById('cat-all');
  const catCheckboxes = document.querySelectorAll('#category-filters-container input[type="checkbox"]:not(#cat-all)');
  const headerSearchInput = document.querySelector('input[placeholder="상품명 또는 바코드 검색"]');
  const bodySearchInput = document.querySelector('input[placeholder="상품명 또는 브랜드 검색"]');

  let allProducts = [];

  try {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) throw new Error('상품 로딩 실패');
    allProducts = await response.json();
  } catch (err) {
    console.error(err);
    gridContainer.innerHTML = '<p class="col-span-full text-center py-xl text-error">상품 정보를 불러오지 못했습니다.</p>';
    return;
  }

  // Uses global mapDbCategoryToFilter

  // Uses global extractBaseName

  let currentPage = 1;
  const itemsPerPage = 9;

  const renderProducts = () => {
    gridContainer.innerHTML = '';
    
    const searchQuery = (bodySearchInput ? bodySearchInput.value : '').trim().toLowerCase();
    
    // Checked categories mapping
    const checkedCats = [];
    const catAllChecked = catAll ? catAll.checked : true;
    if (!catAllChecked) {
      catCheckboxes.forEach(cb => {
        if (cb.checked) {
          checkedCats.push(cb.value);
        }
      });
    }

    // 1. Filter products first
    const filteredProducts = allProducts.filter(product => {
      const matched = product.allergens.filter(al => {
        return activeAllergies.some(ua => ua === al.display_name || ua.toLowerCase() === al.name.toLowerCase());
      });
      if (matched.length > 0) return false;

      const mappedCategory = mapDbCategoryToFilter(product.category_name);
      if (!catAllChecked && checkedCats.length > 0) {
        if (!mappedCategory || !checkedCats.includes(mappedCategory)) return false;
      }

      if (searchQuery) {
        const title = product.name.toLowerCase();
        const brand = (product.brand || '').toLowerCase();
        if (!title.includes(searchQuery) && !brand.includes(searchQuery)) return false;
      }

      return true;
    });

    // 2. Deduplicate products by base name
    const baseNamesSeen = new Set();
    const uniqueProducts = [];
    filteredProducts.forEach(product => {
      const base = extractBaseName(product.name);
      if (!baseNamesSeen.has(base)) {
        baseNamesSeen.add(base);
        uniqueProducts.push(product);
      }
    });

    // 3. Paginate products
    const totalCount = uniqueProducts.length;
    const totalPages = Math.ceil(totalCount / itemsPerPage);
    if (currentPage > totalPages) currentPage = 1;

    const paginatedProducts = uniqueProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // 4. Render product cards
    paginatedProducts.forEach(product => {
      const mappedCategory = mapDbCategoryToFilter(product.category_name);
      const card = document.createElement('div');
      card.className = "product-card cursor-pointer bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant shadow-sm hover:shadow-lg transition-shadow group flex flex-col justify-between";
      card.setAttribute('data-barcode', product.barcode);
      card.setAttribute('data-price', product.price);
      card.setAttribute('data-name', product.name);
      card.setAttribute('data-brand', product.brand || '');
      card.setAttribute('data-category', mappedCategory);

      const formattedPrice = product.price ? `₩${Number(product.price).toLocaleString()}` : '';

      card.innerHTML = `
        <div>
          <div class="relative h-48 bg-surface-container-high overflow-hidden">
            <img loading="lazy" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="${product.name}" src="${product.image_url || ''}"/>
            <div class="absolute top-sm right-sm px-md py-xs bg-primary-container text-on-primary-container rounded-full font-label-sm text-label-sm flex items-center gap-xs shadow-sm z-10">
              <span class="material-symbols-outlined text-[14px]" data-icon="check_circle" data-weight="fill" style="font-variation-settings: 'FILL' 1;">check_circle</span>
              섭취 가능
            </div>
          </div>
          <div class="p-md space-y-sm">
            <div>
              <span class="text-label-sm font-label-sm text-outline">${product.brand || ''}</span>
              <h3 class="text-body-lg font-headline-md text-on-surface font-semibold truncate">${product.name}</h3>
            </div>
          </div>
        </div>
        <div class="p-md pt-0 flex items-center justify-between">
          <span class="text-headline-md font-bold text-[#1b5e20] dark:text-[#81c784]">${formattedPrice}</span>
          <button class="add-to-cart-btn p-sm bg-surface-container text-primary rounded-lg hover:bg-primary hover:text-on-primary transition-colors active:scale-95 flex items-center justify-center">
            <span class="material-symbols-outlined" data-icon="shopping_cart">shopping_cart</span>
          </button>
        </div>
      `;

      card.addEventListener('click', (e) => {
        if (e.target.closest('.add-to-cart-btn')) {
          e.stopPropagation();
          if (!localStorage.getItem('token')) {
            openModal();
            return;
          }
          addToCart({
            barcode: product.barcode,
            name: product.name,
            brand: product.brand,
            image: product.image_url,
            price: product.price
          });
          showCartToast();
          return;
        }
        saveLastClickedProduct(product, userAllergies);
        window.location.href = `/shop_food?id=${product.id}`;
      });

      gridContainer.appendChild(card);
    });

    // 5. Render page numbers
    const paginationContainer = document.getElementById('shop-pagination');
    if (paginationContainer) {
      paginationContainer.innerHTML = '';
      if (totalPages > 1) {
        for (let i = 1; i <= totalPages; i++) {
          const btn = document.createElement('button');
          btn.textContent = i;
          if (i === currentPage) {
            btn.className = "w-10 h-10 bg-primary text-on-primary rounded-lg font-bold flex items-center justify-center active:scale-95 transition-all shadow-sm cursor-pointer";
          } else {
            btn.className = "w-10 h-10 bg-surface-container text-on-surface-variant hover:bg-surface-container-high rounded-lg font-medium flex items-center justify-center active:scale-95 transition-all cursor-pointer";
          }
          btn.addEventListener('click', () => {
            currentPage = i;
            renderProducts();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          });
          paginationContainer.appendChild(btn);
        }
      }
    }

    if (totalCount === 0) {
      gridContainer.innerHTML = '<p class="col-span-full text-center py-xl text-on-surface-variant">조건에 맞는 상품이 없습니다.</p>';
      if (paginationContainer) paginationContainer.innerHTML = '';
    }
  };

  const applyShopFilters = () => {
    currentPage = 1;
    renderProducts();
  };

  // Bind Category checkboxes changes
  if (catAll) {
    catAll.addEventListener('change', () => {
      if (catAll.checked) {
        catCheckboxes.forEach(cb => cb.checked = false);
      }
      applyShopFilters();
    });
  }

  catCheckboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      if (cb.checked && catAll) {
        catAll.checked = false;
      }
      const anyChecked = Array.from(catCheckboxes).some(c => c.checked);
      if (!anyChecked && catAll) {
        catAll.checked = true;
      }
      applyShopFilters();
    });
  });

  const renderShopAllergens = () => {
    const container = document.getElementById('shop-allergies-container');
    if (!container) return;

    container.innerHTML = '';

    // Render active user allergies
    activeAllergies.forEach(allergy => {
      const btn = document.createElement('button');
      btn.className = "px-md py-sm bg-primary-container text-on-primary-container rounded-full font-label-sm text-label-sm flex items-center gap-xs cursor-pointer active:scale-95 transition-transform";
      btn.innerHTML = `${allergy} <span class="material-symbols-outlined text-[16px] text-on-primary-container hover:text-error transition-colors" data-icon="close">close</span>`;
      
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        activeAllergies = activeAllergies.filter(x => x !== allergy);
        renderShopAllergens();
        applyShopFilters();
      });

      container.appendChild(btn);
    });

    // Render the "+ 추가" button
    const addBtn = document.createElement('button');
    addBtn.className = "px-md py-sm bg-surface-container-high text-on-surface-variant rounded-full font-label-sm text-label-sm hover:bg-secondary-container transition-colors cursor-pointer active:scale-95 transition-transform";
    addBtn.innerText = "+ 추가";
    
    addBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (!localStorage.getItem('token')) {
        alert('로그인이 필요한 서비스입니다.');
        openModal();
        return;
      }
      
      // Replace this button with a select element
      const select = document.createElement('select');
      select.className = "px-md py-sm bg-surface-container-high text-on-surface-variant rounded-full font-label-sm text-label-sm focus:ring-1 focus:ring-primary border-none cursor-pointer";
      
      // Default option
      const defaultOpt = document.createElement('option');
      defaultOpt.value = "";
      defaultOpt.innerText = "선택해주세요";
      defaultOpt.disabled = true;
      defaultOpt.selected = true;
      select.appendChild(defaultOpt);
      
      // Add remaining standard allergens
      const remaining = STANDARD_ALLERGENS.filter(x => !activeAllergies.includes(x));
      remaining.forEach(item => {
        const opt = document.createElement('option');
        opt.value = item;
        opt.innerText = item;
        select.appendChild(opt);
      });
      
      // Add custom option
      const customOpt = document.createElement('option');
      customOpt.value = "__custom__";
      customOpt.innerText = "+ 직접 입력";
      select.appendChild(customOpt);
      
      // Replace button with select
      container.replaceChild(select, addBtn);
      select.focus();
      
      // Event listener for select change
      select.addEventListener('change', () => {
        const val = select.value;
        if (val === "__custom__") {
          const newAllergen = prompt("추가할 알레르기 성분을 입력하세요:");
          if (newAllergen && newAllergen.trim()) {
            const trimmed = newAllergen.trim();
            if (activeAllergies.includes(trimmed)) {
              alert('이미 필터에 존재하는 성분입니다.');
              renderShopAllergens();
              return;
            }
            activeAllergies.push(trimmed);
            renderShopAllergens();
            applyShopFilters();
          } else {
            renderShopAllergens();
          }
        } else if (val) {
          activeAllergies.push(val);
          renderShopAllergens();
          applyShopFilters();
        }
      });
      
      // Blur listener to reset if they click away without changing
      select.addEventListener('blur', () => {
        setTimeout(() => {
          if (container.contains(select)) {
            renderShopAllergens();
          }
        }, 200);
      });
    });

    container.appendChild(addBtn);
  };

  // Initial evaluation and rendering
  applyShopFilters();
  renderShopAllergens();

  // Bind Apply Filter button to database sync
  const applyFilterBtn = Array.from(document.querySelectorAll('aside button')).find(btn => 
    btn.textContent.includes('필터 적용하기')
  );
  if (applyFilterBtn) {
    // Clone and replace to prevent multiple event listeners
    const newApplyBtn = applyFilterBtn.cloneNode(true);
    applyFilterBtn.parentNode.replaceChild(newApplyBtn, applyFilterBtn);

    newApplyBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      const token = localStorage.getItem('token');
      if (!token) {
        alert('필터 설정을 임시 적용합니다. 영구 저장하려면 로그인해주세요.');
        applyShopFilters();
        return;
      }
      
      try {
        newApplyBtn.disabled = true;
        newApplyBtn.textContent = '적용 중...';
        
        const response = await fetch(`${API_URL}/users/allergies`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ allergies: activeAllergies })
        });

        if (!response.ok) {
          throw new Error('저장 실패');
        }

        alert('🎉 알레르기 설정이 데이터베이스에 저장되었고 필터가 성공적으로 반영되었습니다!');
        newApplyBtn.disabled = false;
        newApplyBtn.textContent = '필터 적용하기';
        
        // Update global greeting header or state
        checkLoginStatus(); 
      } catch (err) {
        console.error(err);
        alert('필터 설정 저장 중 오류가 발생했습니다.');
        newApplyBtn.disabled = false;
        newApplyBtn.textContent = '필터 적용하기';
      }
    });
  }

  const handleSearch = (e) => {
    const query = e.target.value;
    if (headerSearchInput && headerSearchInput !== e.target) {
      headerSearchInput.value = query;
    }
    if (bodySearchInput && bodySearchInput !== e.target) {
      bodySearchInput.value = query;
    }
    applyShopFilters();

    // Update URL query parameter without page reload
    const url = new URL(window.location.href);
    if (query.trim()) {
      url.searchParams.set('search', query.trim());
    } else {
      url.searchParams.delete('search');
    }
    window.history.replaceState({}, '', url.toString());
  };

  if (headerSearchInput) {
    headerSearchInput.addEventListener('input', handleSearch);
  }
  if (bodySearchInput) {
    bodySearchInput.addEventListener('input', handleSearch);
  }

  // Handle optional search query parameter on page load
  const urlParams = new URLSearchParams(window.location.search);
  const searchVal = urlParams.get('search');
  if (searchVal) {
    if (headerSearchInput) headerSearchInput.value = searchVal;
    if (bodySearchInput) bodySearchInput.value = searchVal;
    applyShopFilters();
  }
}

// 3. Shop Food Detail Page Evaluator
async function initShopFoodPage(userAllergies = []) {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  const barcode = urlParams.get('barcode');

  try {
    let response;
    if (id) {
      response = await fetch(`${API_URL}/products/detail/${id}`);
    } else if (barcode) {
      response = await fetch(`${API_URL}/products/${barcode}`);
    } else {
      response = await fetch(`${API_URL}/products/detail/4`);
    }

    if (!response.ok) {
      throw new Error('상품 정보를 찾을 수 없습니다.');
    }
    const product = await response.json();
    renderProductDetail(product, userAllergies);
  } catch (err) {
    console.error(err);
    const mainSection = document.querySelector('main');
    if (mainSection) {
      mainSection.innerHTML = `
        <div class="max-w-md mx-auto mt-10 p-lg bg-surface-container-lowest border border-error/30 rounded-xl text-center">
          <span class="material-symbols-outlined text-error text-[48px]">warning</span>
          <h1 class="text-headline-md text-on-surface font-bold mt-sm">상품 정보 로드 실패</h1>
          <p class="text-on-surface-variant text-body-sm mt-xs">존재하지 않거나 DB에서 불러올 수 없는 상품입니다.</p>
          <button onclick="window.history.back()" class="mt-md px-md py-sm bg-primary text-on-primary rounded-lg text-label-md active:scale-95 transition-transform">돌아가기</button>
        </div>
      `;
    }
  }
}

function renderProductDetail(product, userAllergies) {
  saveLastClickedProduct(product, userAllergies);
  const imgEl = document.getElementById('product-detail-img');
  if (imgEl && product.image_url) imgEl.src = product.image_url;

  const catPathEl = document.getElementById('product-detail-category-path');
  if (catPathEl) {
    catPathEl.textContent = mapDbCategoryToFilter(product.category_name) || '기타';
  }

  const brandEl = document.getElementById('product-detail-brand');
  if (brandEl) brandEl.textContent = product.brand;

  const titleEl = document.getElementById('product-detail-title');
  if (titleEl) titleEl.textContent = product.name;

  const priceEl = document.getElementById('product-detail-price');
  if (priceEl) {
    const formattedPrice = product.price ? `₩${Number(product.price).toLocaleString()}` : '가격 정보 없음';
    priceEl.textContent = formattedPrice;
  }

  // Render options select dropdown
  const optContainer = document.getElementById('product-option-container');
  const optSelect = document.getElementById('product-option-select');
  if (optContainer && optSelect) {
    if (product.options && product.options.length > 1) {
      optContainer.classList.remove('hidden');
      optSelect.innerHTML = '';
      
      product.options.forEach(opt => {
        const optionEl = document.createElement('option');
        optionEl.value = opt.id;
        optionEl.textContent = opt.name;
        if (opt.id === product.id) {
          optionEl.selected = true;
        }
        optSelect.appendChild(optionEl);
      });

      const newSelect = optSelect.cloneNode(true);
      optSelect.parentNode.replaceChild(newSelect, optSelect);

      newSelect.addEventListener('change', (e) => {
        const selectedId = e.target.value;
        window.location.href = `/shop_food?id=${selectedId}`;
      });
    } else {
      optContainer.classList.add('hidden');
    }
  }

  const descEl = document.getElementById('product-detail-desc');
  if (descEl) descEl.textContent = `${product.brand}의 엄선된 원료로 만든 프리미엄 제품입니다. 원재료명: ${product.ingredients_text}`;

  // Evaluate matching allergies
  const matchedAllergens = product.allergens.filter(al => {
    return userAllergies.some(ua => ua === al.display_name || ua.toLowerCase() === al.name.toLowerCase());
  });

  const hasAllergy = matchedAllergens.length > 0;
  
  const badgeEl = document.getElementById('product-detail-badge');
  const badgeIcon = document.getElementById('product-detail-badge-icon');
  const badgeText = document.getElementById('product-detail-badge-text');

  const warningText = document.getElementById('product-detail-warning-text');
  const warningIcon = document.getElementById('product-detail-warning-icon');
  const warningMsg = document.getElementById('product-detail-warning-message');

  const analysisBox = document.getElementById('product-detail-analysis-box');
  const analysisText = document.getElementById('product-detail-analysis-text');

  const guideCard = document.getElementById('product-detail-guide-card');
  const guideIconBg = document.getElementById('product-detail-guide-icon-bg');
  const guideIcon = document.getElementById('product-detail-guide-icon');
  const guideTitle = document.getElementById('product-detail-guide-title');
  const guideText = document.getElementById('product-detail-guide-text');

  const cartBtn = document.getElementById('add-to-cart-detail-btn');
  const buyBtn = document.getElementById('quick-buy-detail-btn');
  [cartBtn, buyBtn].forEach(btn => {
    if (btn) {
      btn.setAttribute('data-barcode', product.barcode);
      btn.setAttribute('data-name', product.name);
      btn.setAttribute('data-brand', product.brand);
      btn.setAttribute('data-image', product.image_url || '');
      btn.setAttribute('data-price', product.price || 0);
      btn.setAttribute('data-unsafe', hasAllergy ? 'true' : 'false');
      btn.setAttribute('data-allergens', matchedAllergens.map(a => a.display_name).join(', '));
    }
  });

  if (hasAllergy) {
    const allergenNames = matchedAllergens.map(a => a.display_name).join(', ');
    
    if (badgeEl) {
      badgeEl.className = "bg-error text-on-error px-4 py-2 rounded-full font-label-lg flex items-center gap-xs shadow-lg";
      if (badgeIcon) badgeIcon.textContent = "cancel";
      if (badgeText) badgeText.textContent = "섭취 불가";
    }

    if (warningText) {
      warningText.className = "flex items-center gap-xs text-error font-label-lg";
      if (warningIcon) warningIcon.textContent = "error";
      if (warningMsg) warningMsg.textContent = `사용자님의 알레르기 설정 [${allergenNames}]에 위험한 제품입니다.`;
    }

    if (analysisBox) {
      analysisBox.className = "p-md bg-error-container/30 rounded-lg border-l-4 border-error";
    }
    if (analysisText) {
      analysisText.innerHTML = `<strong>분석 결과:</strong> 사용자님의 관심 알레르기 유발 성분인 <span class="text-error font-bold">${allergenNames}</span>이 포함되어 있습니다.`;
    }

    if (guideCard) {
      guideCard.className = "bg-error-container/10 p-lg rounded-xl border border-error/20 flex flex-col justify-between";
    }
    if (guideIconBg) {
      guideIconBg.className = "w-12 h-12 bg-error rounded-full flex items-center justify-center mb-md";
    }
    if (guideIcon) {
      guideIcon.textContent = "warning";
      guideIcon.className = "material-symbols-outlined text-on-error";
    }
    if (guideTitle) {
      guideTitle.className = "font-headline-md text-error mb-sm";
    }
    if (guideText) {
      guideText.innerHTML = `사용자님은 <strong>${allergenNames} 알레르기</strong>가 있으므로 본 제품 섭취가 불가능합니다. 아몬드는 심각한 알레르기 반응을 유발할 수 있으므로 절대 섭취하지 마십시오.`;
    }
  } else {
    if (badgeEl) {
      badgeEl.className = "bg-primary text-on-primary px-4 py-2 rounded-full font-label-lg flex items-center gap-xs shadow-lg";
      if (badgeIcon) badgeIcon.textContent = "check_circle";
      if (badgeText) badgeText.textContent = "안전한 식품";
    }

    if (warningText) {
      warningText.className = "flex items-center gap-xs text-secondary font-label-lg";
      if (warningIcon) warningIcon.textContent = "verified_user";
      if (warningMsg) warningMsg.textContent = "사용자님의 알레르기 설정에 안전한 제품입니다.";
    }

    if (analysisBox) {
      analysisBox.className = "p-md bg-surface-container-low rounded-lg border-l-4 border-primary";
    }
    if (analysisText) {
      analysisText.innerHTML = `<strong>분석 결과:</strong> 사용자님의 관심 알레르기 유발 물질이 검출되지 않았습니다.`;
    }

    if (guideCard) {
      guideCard.className = "bg-primary-container/10 p-lg rounded-xl border border-primary/20 flex flex-col justify-between";
    }
    if (guideIconBg) {
      guideIconBg.className = "w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-md";
    }
    if (guideIcon) {
      guideIcon.textContent = "health_and_safety";
      guideIcon.className = "material-symbols-outlined text-on-primary";
    }
    if (guideTitle) {
      guideTitle.className = "font-headline-md text-on-primary-container mb-sm";
    }
    if (guideText) {
      guideText.innerHTML = `사용자님은 설정된 알레르기 유발 유해 성분이 없으므로 본 제품 섭취가 가능합니다. 안심하고 식단에 추가하세요!`;
    }
  }

  const ingredientsListEl = document.getElementById('product-detail-ingredients');
  if (ingredientsListEl) {
    ingredientsListEl.innerHTML = '';
    const items = product.ingredients_text.split(/,\s*/);
    items.forEach(item => {
      const isAllergenic = userAllergies.includes(item);
      const span = document.createElement('span');
      if (isAllergenic) {
        span.className = "px-3 py-1 bg-error-container/30 rounded-full text-body-sm font-bold border border-error text-error";
      } else {
        span.className = "px-3 py-1 bg-surface-container rounded-full text-body-sm border border-outline-variant";
      }
      span.textContent = item;
      ingredientsListEl.appendChild(span);
    });
  }

  loadAlternativeRecommendations(product, userAllergies);
}

// 3.1. Dynamic Alternative Recommendations Loader
async function loadAlternativeRecommendations(currentProduct, userAllergies = []) {
  const container = document.getElementById('product-detail-recommendations');
  if (!container) return;

  try {
    let recommended = [];
    if (currentProduct.id) {
      const token = localStorage.getItem('token');
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const response = await fetch(`${API_URL}/products/${currentProduct.id}/alternatives`, { headers });
      if (response.ok) {
        recommended = await response.json();
      }
    }

    if (recommended.length === 0) {
      const response = await fetch(`${API_URL}/products`);
      if (!response.ok) {
        throw new Error('대체 상품 목록 로드 실패');
      }
      const allProducts = await response.json();
      const otherProducts = allProducts.filter(p => p.barcode !== currentProduct.barcode);
      const safeProducts = otherProducts.filter(p => {
        const matched = p.allergens.filter(al => {
          return userAllergies.some(ua => ua === al.display_name || ua.toLowerCase() === al.name.toLowerCase());
        });
        return matched.length === 0;
      });
      const currentGroup = currentProduct.alternative_group;
      const currentCategory = currentProduct.category_name || currentProduct.category_id;
      safeProducts.sort((a, b) => {
        if (currentGroup) {
          const aSameGroup = a.alternative_group === currentGroup ? 1 : 0;
          const bSameGroup = b.alternative_group === currentGroup ? 1 : 0;
          if (aSameGroup !== bSameGroup) return bSameGroup - aSameGroup;
        }
        const currentHasMilk = currentProduct.allergens.some(al => al.name === 'milk');
        if (!currentHasMilk) {
          const aHasMilk = a.allergens.some(al => al.name === 'milk') ? 1 : 0;
          const bHasMilk = b.allergens.some(al => al.name === 'milk') ? 1 : 0;
          if (aHasMilk !== bHasMilk) return aHasMilk - bHasMilk;
        }
        const aSameCat = (a.category_name || a.category_id) === currentCategory ? 1 : 0;
        const bSameCat = (b.category_name || b.category_id) === currentCategory ? 1 : 0;
        return bSameCat - aSameCat;
      });
      recommended = safeProducts;
    }

    // Group/Deduplicate by base name to avoid multiple sizes of the same product
    const seenBaseNames = new Set();
    const currentBaseName = extractBaseName(currentProduct.name);
    seenBaseNames.add(currentBaseName);

    const uniqueRecommended = [];
    for (const item of recommended) {
      const base = extractBaseName(item.name);
      if (!seenBaseNames.has(base)) {
        seenBaseNames.add(base);
        uniqueRecommended.push(item);
      }
    }
    recommended = uniqueRecommended.slice(0, 4);

    container.innerHTML = '';

    if (recommended.length === 0) {
      container.innerHTML = '<p class="col-span-full text-center text-on-surface-variant font-body-sm py-lg">추천 가능한 안전한 대체 상품이 없습니다.</p>';
      return;
    }

    recommended.forEach(item => {
      const card = document.createElement('div');
      card.className = "bg-surface-container-lowest p-sm rounded-xl border border-outline-variant hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between active:scale-98";
      
      const formattedPrice = item.price ? `₩${Number(item.price).toLocaleString()}` : '';

      card.innerHTML = `
        <div>
          <div class="aspect-square bg-surface-container rounded-lg overflow-hidden mb-sm relative">
            <img loading="lazy" alt="${item.name}" class="w-full h-full object-cover" src="${item.image_url || ''}"/>
            <div class="absolute top-2 right-2 px-md py-xs bg-primary-container text-on-primary-container rounded-full text-[10px] font-bold shadow-sm z-10 flex items-center gap-xs">
              <span class="material-symbols-outlined text-[10px]" style="font-variation-settings: 'FILL' 1;">check_circle</span>
              SAFE
            </div>
          </div>
          <p class="font-label-sm text-outline truncate">${item.brand || ''}</p>
          <p class="font-body-md text-on-surface truncate font-semibold">${item.name}</p>
        </div>
        <div class="flex justify-between items-center mt-sm pt-xs border-t border-outline-variant/30">
          <span class="text-label-md font-bold text-[#1b5e20] dark:text-[#81c784]">${formattedPrice}</span>
          <span class="material-symbols-outlined text-primary text-[20px] hover:scale-115 active:scale-95 transition-transform" data-icon="shopping_cart">shopping_cart</span>
        </div>
      `;

      card.addEventListener('click', (e) => {
        if (e.target.closest('[data-icon="shopping_cart"]')) {
          e.stopPropagation();
          if (!localStorage.getItem('token')) {
            openModal();
            return;
          }
          addToCart({
            barcode: item.barcode,
            name: item.name,
            brand: item.brand,
            image: item.image_url,
            price: item.price
          });
          showCartToast();
          return;
        }
        window.location.href = `/shop_food?id=${item.id}`;
      });

      container.appendChild(card);
    });
  } catch (err) {
    console.error(err);
    container.innerHTML = '<p class="col-span-full text-center text-error font-body-sm py-lg">대체 상품 추천 목록을 불러오는 과정에서 오류가 발생했습니다.</p>';
  }
}


// 4. Barcode Scan Result Page Evaluator
async function initScanPage(userAllergies = []) {
  const urlParams = new URLSearchParams(window.location.search);
  const barcode = urlParams.get('barcode');
  const mockAllergy = urlParams.get('mockAllergy');
  if (mockAllergy) {
    userAllergies = mockAllergy.split(',');
  }

  const scanInputCard = document.getElementById('scan-input-card');
  const scanContainerBox = document.getElementById('scan-container-box');
  const scanStatusSection = document.getElementById('scan-status-section');
  const scanDetailsContainer = document.getElementById('scan-details-container');
  const scanAlternativesSection = document.getElementById('scan-alternatives-section');

  if (!barcode) {
    // Show scanner/input card, hide results
    if (scanInputCard) scanInputCard.classList.remove('hidden');
    if (scanContainerBox) scanContainerBox.classList.add('hidden');
    if (scanStatusSection) scanStatusSection.classList.add('hidden');
    if (scanDetailsContainer) scanDetailsContainer.classList.add('hidden');
    if (scanAlternativesSection) scanAlternativesSection.classList.add('hidden');

    // Setup camera scan using html5-qrcode
    const startBtn = document.getElementById('start-camera-btn');
    const stopBtn = document.getElementById('stop-camera-btn');
    const readerPlaceholder = document.getElementById('reader-placeholder');
    let html5QrCode = null;

    if (startBtn) {
      startBtn.addEventListener('click', async () => {
        try {
          if (readerPlaceholder) readerPlaceholder.classList.add('hidden');
          if (stopBtn) stopBtn.classList.remove('hidden');

          html5QrCode = new Html5Qrcode("reader");
          const config = {
            fps: 10,
            qrbox: (width, height) => {
              const minEdge = Math.min(width, height);
              const qrboxSize = Math.floor(minEdge * 0.7);
              return {
                width: qrboxSize,
                height: Math.floor(qrboxSize * 0.4)
              };
            }
          };

          await html5QrCode.start(
            { facingMode: "environment" },
            config,
            (decodedText) => {
              if (html5QrCode && html5QrCode.isScanning) {
                html5QrCode.stop().then(() => {
                  window.location.href = `/scan?barcode=${decodedText}`;
                }).catch(err => {
                  console.error(err);
                  window.location.href = `/scan?barcode=${decodedText}`;
                });
              } else {
                window.location.href = `/scan?barcode=${decodedText}`;
              }
            },
            (errorMessage) => {
              // verbose error logs, safe to ignore
            }
          );
        } catch (err) {
          console.error('Camera start failed:', err);
          alert('카메라 시작에 실패했습니다. 카메라 권한 설정을 확인해주세요.');
          if (readerPlaceholder) readerPlaceholder.classList.remove('hidden');
          if (stopBtn) stopBtn.classList.add('hidden');
        }
      });
    }

    if (stopBtn) {
      stopBtn.addEventListener('click', async () => {
        if (html5QrCode && html5QrCode.isScanning) {
          try {
            await html5QrCode.stop();
          } catch (e) {
            console.error(e);
          }
        }
        if (readerPlaceholder) readerPlaceholder.classList.remove('hidden');
        if (stopBtn) stopBtn.classList.add('hidden');
      });
    }

    // Setup manual input
    const manualInput = document.getElementById('manual-barcode-input');
    const manualSubmit = document.getElementById('manual-submit-btn');
    if (manualSubmit && manualInput) {
      const submitHandler = () => {
        const code = manualInput.value.trim();
        if (!code) {
          alert('바코드 번호를 입력해주세요.');
          return;
        }
        window.location.href = `/scan?barcode=${code}`;
      };
      manualSubmit.addEventListener('click', submitHandler);
      manualInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          submitHandler();
        }
      });
    }

    return;
  }

  // If barcode is present, hide scanner and show loading skeleton
  if (scanInputCard) scanInputCard.classList.add('hidden');
  if (scanContainerBox) scanContainerBox.classList.add('hidden');
  if (scanStatusSection) scanStatusSection.classList.add('hidden');
  if (scanDetailsContainer) scanDetailsContainer.classList.add('hidden');
  if (scanAlternativesSection) scanAlternativesSection.classList.add('hidden');

  // Insert or show loading container
  let loadingContainer = document.getElementById('scan-loading-container');
  if (!loadingContainer) {
    loadingContainer = document.createElement('div');
    loadingContainer.id = 'scan-loading-container';
    loadingContainer.className = 'space-y-md w-full';
    loadingContainer.innerHTML = `
      <!-- Image & Text Card Skeleton -->
      <div class="bg-white rounded-[24px] border border-outline-variant/30 overflow-hidden flex flex-col">
        <div class="aspect-[4/3] shimmer bg-slate-200 dark:bg-slate-800"></div>
        <div class="p-lg space-y-sm">
          <div class="h-6 w-2/3 bg-slate-200 dark:bg-slate-800 rounded shimmer"></div>
          <div class="flex gap-xs">
            <div class="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded shimmer"></div>
            <div class="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded shimmer"></div>
          </div>
        </div>
      </div>

      <!-- Safety Alert Banner Skeleton -->
      <div class="bg-slate-100 dark:bg-slate-900 border border-outline-variant/20 p-lg rounded-2xl flex flex-col items-center justify-center gap-sm">
        <div class="w-14 h-14 rounded-full bg-slate-200 dark:bg-slate-800 shimmer"></div>
        <div class="space-y-xs w-full flex flex-col items-center">
          <div class="h-5 w-1/2 bg-slate-200 dark:bg-slate-800 rounded shimmer"></div>
          <div class="h-4 w-3/4 bg-slate-200 dark:bg-slate-800 rounded shimmer mt-1"></div>
        </div>
      </div>

      <!-- Bento Grid & Ingredients Analysis Skeleton -->
      <div class="bg-white p-lg rounded-2xl border border-outline-variant/30 space-y-md">
        <div class="h-5 w-1/3 bg-slate-200 dark:bg-slate-800 rounded shimmer mb-4"></div>
        <div class="grid grid-cols-2 gap-sm">
          <div class="h-16 bg-slate-100 dark:bg-slate-900 rounded-xl shimmer"></div>
          <div class="h-16 bg-slate-100 dark:bg-slate-900 rounded-xl shimmer"></div>
          <div class="h-16 bg-slate-100 dark:bg-slate-900 rounded-xl shimmer"></div>
          <div class="h-16 bg-slate-100 dark:bg-slate-900 rounded-xl shimmer"></div>
        </div>
      </div>
    `;
    const main = document.querySelector('main');
    if (main) {
      main.appendChild(loadingContainer);
    }
  } else {
    loadingContainer.classList.remove('hidden');
  }

  // Define 600ms minimum loading delay
  const delayPromise = new Promise(resolve => setTimeout(resolve, 600));

  let fetchSuccess = false;
  let productData = null;
  let fetchError = null;

  if (barcode === '072521011210' || barcode === '72521011210') {
    // Tomato Soup Simulation
    const mockTomatoSoup = {
      id: 9999,
      name: '토마토 수프 (Campbell Tomato Soup)',
      brand: '캠벨 (Campbell)',
      barcode: barcode,
      is_external: false,
      image_url: 'https://images.unsplash.com/photo-1547592165-e1d17fed6005?w=500',
      allergens: [{ display_name: '밀', name: 'wheat' }],
      ingredients_text: '토마토 페이스트, 밀가루, 설탕, 소금, 정제수, 식물성 유지',
      allergy_text: '밀 함유'
    };

    renderScannedProduct(mockTomatoSoup, userAllergies);
    evaluateTomatoSoup(userAllergies);

    await delayPromise;

    if (loadingContainer) loadingContainer.classList.add('hidden');

    // Show actual sections with transition
    if (scanContainerBox) {
      scanContainerBox.classList.remove('hidden');
      scanContainerBox.classList.add('fade-in-slide');
    }
    if (scanStatusSection) {
      scanStatusSection.classList.remove('hidden');
      scanStatusSection.classList.add('fade-in-slide');
    }
    if (scanDetailsContainer) {
      scanDetailsContainer.classList.remove('hidden');
      scanDetailsContainer.classList.add('fade-in-slide');
    }
    if (scanAlternativesSection) {
      scanAlternativesSection.classList.remove('hidden');
      scanAlternativesSection.classList.add('fade-in-slide');
    }
    return;
  }

  try {
    const response = await fetch(`${API_URL}/products/${barcode}`);
    if (!response.ok) {
      throw new Error('상품 정보를 찾을 수 없습니다.');
    }
    productData = await response.json();
    fetchSuccess = true;
  } catch (err) {
    fetchError = err;
  }

  // Wait for the minimal delay
  await delayPromise;

  if (loadingContainer) loadingContainer.classList.add('hidden');

  if (fetchSuccess && productData) {
    renderScannedProduct(productData, userAllergies);
    
    // Show actual sections with transition
    if (scanContainerBox) {
      scanContainerBox.classList.remove('hidden');
      scanContainerBox.classList.add('fade-in-slide');
    }
    if (scanStatusSection) {
      scanStatusSection.classList.remove('hidden');
      scanStatusSection.classList.add('fade-in-slide');
    }
    if (scanDetailsContainer) {
      scanDetailsContainer.classList.remove('hidden');
      scanDetailsContainer.classList.add('fade-in-slide');
    }
    if (scanAlternativesSection) {
      scanAlternativesSection.classList.remove('hidden');
      scanAlternativesSection.classList.add('fade-in-slide');
    }
  } else {
    // Handle error case
    const err = fetchError || new Error('상품 정보를 찾을 수 없습니다.');
    console.error(err);
    const titleEl = document.getElementById('scan-safety-title');
    const descEl = document.getElementById('scan-safety-desc');
    const badgeEl = document.getElementById('scan-safety-badge');
    const iconEl = document.getElementById('scan-safety-icon');
    const statusSection = document.getElementById('scan-status-section');
    const barcodeEl = document.getElementById('scan-barcode-text');

    if (barcodeEl) barcodeEl.textContent = `Barcode: ${barcode}`;
    if (titleEl) {
      titleEl.innerText = "잘못된 상품입니다.";
      titleEl.className = "font-headline-lg text-headline-lg text-error font-bold";
    }
    if (descEl) descEl.innerText = "존재하지 않거나 DB/OpenAPI 에서 불러올 수 없는 바코드 상품입니다.";
    if (badgeEl) badgeEl.className = "w-16 h-16 rounded-full bg-error flex items-center justify-center text-on-error shadow-lg";
    if (iconEl) {
      iconEl.textContent = "cancel";
      iconEl.className = "material-symbols-outlined text-[40px] text-on-error";
    }
    if (statusSection) {
      statusSection.className = "bg-error/10 p-lg rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.04)] flex flex-col md:flex-row items-center justify-between gap-md border border-error";
    }

    if (scanContainerBox) {
      scanContainerBox.classList.remove('hidden');
      scanContainerBox.classList.add('fade-in-slide');
    }
    if (statusSection) {
      statusSection.classList.remove('hidden');
      statusSection.classList.add('fade-in-slide');
    }
    if (scanDetailsContainer) scanDetailsContainer.classList.add('hidden');
    if (scanAlternativesSection) scanAlternativesSection.classList.add('hidden');
  }
}

function evaluateTomatoSoup(userAllergies) {
  const hasWheatAllergy = userAllergies.includes('밀');
  const titleEl = document.getElementById('scan-safety-title');
  const descEl = document.getElementById('scan-safety-desc');
  const badgeEl = document.getElementById('scan-safety-badge');
  const iconEl = document.getElementById('scan-safety-icon');
  const noteEl = document.getElementById('scan-ingredients-note');
  const statusSection = document.getElementById('scan-status-section');
  const floatingBadgeEl = document.getElementById('scan-safety-badge-floating');

  if (hasWheatAllergy) {
    if (floatingBadgeEl) {
      floatingBadgeEl.className = "absolute top-4 right-4 bg-error text-white px-3.5 py-1.5 rounded-full text-label-md font-bold shadow-sm flex items-center gap-xs transition-all duration-300 select-none";
      floatingBadgeEl.innerHTML = `<span class="material-symbols-outlined text-[16px] font-bold">warning</span><span>UNSAFE</span>`;
    }
    if (titleEl) {
      titleEl.innerText = "주의! 알레르기 유발물질 포함";
      titleEl.className = "font-headline-md text-error font-bold text-lg";
    }
    if (descEl) descEl.innerText = "제조시설 내 교차오염 가능 성분(밀)이 검출되었습니다. 섭취에 유의하시기 바랍니다.";
    if (badgeEl) badgeEl.className = "w-14 h-14 rounded-full bg-error flex items-center justify-center text-white shadow-sm transition-all duration-300";
    if (iconEl) {
      iconEl.textContent = "warning";
      iconEl.className = "material-symbols-outlined text-[32px] font-bold text-white";
    }
    if (statusSection) {
      statusSection.className = "bg-[#fdf2f2] border border-[#fecaca] p-lg rounded-2xl flex flex-col items-center justify-center text-center gap-sm transition-all duration-300 w-full";
    }
    if (noteEl) {
      noteEl.parentElement.className = "mt-md p-md bg-[#fdf2f2] rounded-xl border-l-4 border-error";
    }
  } else {
    if (floatingBadgeEl) {
      floatingBadgeEl.className = "absolute top-4 right-4 bg-[#24d27a] text-white px-3.5 py-1.5 rounded-full text-label-md font-bold shadow-sm flex items-center gap-xs transition-all duration-300 select-none";
      floatingBadgeEl.innerHTML = `<span class="material-symbols-outlined text-[16px] font-bold">check_circle</span><span>SAFE</span>`;
    }
    if (titleEl) {
      titleEl.innerText = "안전한 식품입니다";
      titleEl.className = "font-headline-md text-[#0f683d] font-bold text-lg";
    }
    if (descEl) descEl.innerText = "귀하의 프로필과 일치하는 알레르기 유발성분이 검출되지 않았습니다. 안심하고 섭취하셔도 좋습니다.";
    if (badgeEl) badgeEl.className = "w-14 h-14 rounded-full bg-[#24d27a] flex items-center justify-center text-white shadow-sm transition-all duration-300";
    if (iconEl) {
      iconEl.textContent = "shield";
      iconEl.className = "material-symbols-outlined text-[32px] font-bold text-white";
    }
    if (statusSection) {
      statusSection.className = "bg-[#e8f7ee] border border-[#c2ebd1] p-lg rounded-2xl flex flex-col items-center justify-center text-center gap-sm transition-all duration-300 w-full";
    }
    if (noteEl) {
      noteEl.parentElement.className = "mt-md p-md bg-[#f4fbf4] rounded-xl border-l-4 border-[#0f683d]";
    }
  }
}

function renderScannedProduct(product, userAllergies) {
  saveLastClickedProduct(product, userAllergies);

  const brandEl = document.getElementById('scan-product-brand');
  if (brandEl) brandEl.textContent = product.brand || '알수없음';

  const nameEl = document.getElementById('scan-product-name');
  if (nameEl) nameEl.textContent = product.name || '알수없음';

  const extBadge = document.getElementById('scan-external-badge');
  if (extBadge) {
    if (product.is_external) {
      extBadge.classList.remove('hidden');
    } else {
      extBadge.classList.add('hidden');
    }
  }

  const imgEl = document.getElementById('scan-product-img');
  if (imgEl && product.image_url) {
    imgEl.src = product.image_url;
    imgEl.alt = product.name;
  }

  const barcodeEl = document.getElementById('scan-barcode-text');
  if (barcodeEl) {
    barcodeEl.textContent = `Barcode: ${product.barcode}`;
  }

  const matchedAllergens = product.allergens.filter(al => {
    return userAllergies.some(ua => ua === al.display_name || ua.toLowerCase() === al.name.toLowerCase() || al.display_name.includes(ua) || ua.includes(al.display_name));
  });

  const hasAllergy = matchedAllergens.length > 0;

  const titleEl = document.getElementById('scan-safety-title');
  const descEl = document.getElementById('scan-safety-desc');
  const badgeEl = document.getElementById('scan-safety-badge');
  const iconEl = document.getElementById('scan-safety-icon');
  const statusSection = document.getElementById('scan-status-section');
  const floatingBadgeEl = document.getElementById('scan-safety-badge-floating');

  if (hasAllergy) {
    if (floatingBadgeEl) {
      floatingBadgeEl.className = "absolute top-4 right-4 bg-error text-white px-3.5 py-1.5 rounded-full text-label-md font-bold shadow-sm flex items-center gap-xs transition-all duration-300 select-none";
      floatingBadgeEl.innerHTML = `<span class="material-symbols-outlined text-[16px] font-bold">warning</span><span>UNSAFE</span>`;
    }
    if (titleEl) {
      titleEl.innerText = "주의! 알레르기 유발물질 포함";
      titleEl.className = "font-headline-md text-error font-bold text-lg";
    }
    if (descEl) {
      const allergenNames = matchedAllergens.map(a => a.display_name).join(', ');
      descEl.innerText = `사용자님의 알레르기 성분 [${allergenNames}]이(가) 검출되었습니다. 섭취에 유의하시기 바랍니다.`;
    }
    if (badgeEl) badgeEl.className = "w-14 h-14 rounded-full bg-error flex items-center justify-center text-white shadow-sm transition-all duration-300";
    if (iconEl) {
      iconEl.textContent = "warning";
      iconEl.className = "material-symbols-outlined text-[32px] font-bold text-white";
    }
    if (statusSection) {
      statusSection.className = "bg-[#fdf2f2] border border-[#fecaca] p-lg rounded-2xl flex flex-col items-center justify-center text-center gap-sm transition-all duration-300 w-full";
    }
  } else {
    if (floatingBadgeEl) {
      floatingBadgeEl.className = "absolute top-4 right-4 bg-[#24d27a] text-white px-3.5 py-1.5 rounded-full text-label-md font-bold shadow-sm flex items-center gap-xs transition-all duration-300 select-none";
      floatingBadgeEl.innerHTML = `<span class="material-symbols-outlined text-[16px] font-bold">check_circle</span><span>SAFE</span>`;
    }
    if (titleEl) {
      titleEl.innerText = "안전한 식품입니다";
      titleEl.className = "font-headline-md text-[#0f683d] font-bold text-lg";
    }
    if (descEl) {
      descEl.innerText = "귀하의 프로필과 일치하는 알레르기 유발성분이 검출되지 않았습니다. 안심하고 섭취하셔도 좋습니다.";
    }
    if (badgeEl) badgeEl.className = "w-14 h-14 rounded-full bg-[#24d27a] flex items-center justify-center text-white shadow-sm transition-all duration-300";
    if (iconEl) {
      iconEl.textContent = "shield";
      iconEl.className = "material-symbols-outlined text-[32px] font-bold text-white";
    }
    if (statusSection) {
      statusSection.className = "bg-[#e8f7ee] border border-[#c2ebd1] p-lg rounded-2xl flex flex-col items-center justify-center text-center gap-sm transition-all duration-300 w-full";
    }
  }

  const gridEl = document.getElementById('scan-analysis-grid');
  if (gridEl) {
    gridEl.innerHTML = '';
    const mainAllergens = [
      { name: '우유', display: 'Milk', ko: '유제품 없음', koContains: '유제품 검출', icon: 'water_drop' },
      { name: '땅콩', display: 'Peanut', ko: '땅콩 없음', koContains: '땅콩 검출', icon: 'eco' },
      { name: '밀', display: 'Wheat', ko: '밀 없음', koContains: '밀 검출', icon: 'grain' },
      { name: '계란', display: 'Egg', ko: '계란 없음', koContains: '계란 검출', icon: 'egg' },
      { name: '해산물', display: 'Seafood', ko: '해산물 없음', koContains: '해산물 검출', icon: 'waves' },
      { name: '견과류', display: 'Nuts', ko: '견과류 없음', koContains: '견과류 검출', icon: 'nature' }
    ];

    mainAllergens.forEach(item => {
      const isProductAllergen = product.allergens.some(a => a.display_name === item.name);
      const isUserAllergic = userAllergies.includes(item.name);

      let cardClass = "";
      let iconColorClass = "";
      let statusIcon = "";
      let statusIconClass = "";
      let topText = "";
      let bottomText = "";

      if (isProductAllergen) {
        cardClass = "bg-[#fdf2f2] border border-[#fecaca]";
        iconColorClass = "w-10 h-10 rounded-full bg-[#fecaca] flex items-center justify-center text-error";
        statusIcon = "cancel";
        statusIconClass = "material-symbols-outlined text-[18px] text-error absolute top-2 right-2";
        topText = `Contains ${item.display}`;
        bottomText = item.koContains;
      } else {
        cardClass = "bg-[#f1faf5] border border-[#d3eedf]";
        iconColorClass = "w-10 h-10 rounded-full bg-[#d3eedf] flex items-center justify-center text-[#0f683d]";
        statusIcon = "check_circle";
        statusIconClass = "material-symbols-outlined text-[18px] text-[#24d27a] absolute top-2 right-2";
        topText = `${item.display} Free`;
        bottomText = item.ko;
      }

      const card = document.createElement('div');
      card.className = `${cardClass} p-md rounded-xl flex items-center gap-sm relative transition-all duration-200`;
      card.innerHTML = `
        <div class="${iconColorClass}">
          <span class="material-symbols-outlined text-[22px]">${item.icon}</span>
        </div>
        <div class="flex flex-col text-left">
          <span class="text-[10px] text-outline">${topText}</span>
          <span class="font-label-lg font-bold text-on-surface">${bottomText}</span>
        </div>
        <span class="${statusIconClass}">${statusIcon}</span>
      `;
      gridEl.appendChild(card);
    });
  }

  const ingredientsListEl = document.getElementById('scan-ingredients-list');
  if (ingredientsListEl) {
    ingredientsListEl.innerHTML = '';
    const items = product.ingredients_text.split(/,\s*/);
    items.forEach(item => {
      const isAllergenic = userAllergies.some(ua => item.includes(ua) || ua.includes(item));
      const span = document.createElement('span');
      if (isAllergenic) {
        span.className = "px-3.5 py-1.5 bg-[#fdf2f2] text-error border border-error/50 font-bold text-xs rounded-full flex items-center gap-xs transition-all select-none";
        span.innerHTML = `<span class="text-error">●</span> ${item}`;
      } else {
        span.className = "px-3.5 py-1.5 bg-[#e2f6ea] text-[#1b5e20] font-medium text-xs rounded-full flex items-center gap-xs transition-all select-none";
        span.innerHTML = `<span class="text-[#24d27a]">●</span> ${item}`;
      }
      span.textContent = item;
      ingredientsListEl.appendChild(span);
    });
  }

  const noteEl = document.getElementById('scan-ingredients-note');
  if (noteEl) {
    if (product.is_external) {
      noteEl.textContent = `본 제품은 공공데이터 조회 상품(제조/판매: ${product.brand || '알수없음'})이며, 원재료 정보: [${product.ingredients_text || '없음'}], 알레르기 유발 정보: [${product.allergy_text || '없음'}] 입니다.`;
    } else {
      noteEl.textContent = `본 제품은 ${product.brand}사에서 제조되었으며, 원재료명: [${product.ingredients_text}] 입니다.`;
    }
  }

  // Bind add-to-pantry button dynamically if exists
  const addPantryBtn = document.getElementById('add-to-pantry-btn');
  if (addPantryBtn) {
    addPantryBtn.onclick = (e) => {
      e.preventDefault();
      if (!localStorage.getItem('token')) {
        openModal();
        return;
      }
      alert(`${product.name} 상품이 My Pantry에 등록되었습니다!`);
    };
  }

  // Bind share-result button dynamically if exists
  const shareBtn = document.getElementById('share-result-btn');
  if (shareBtn) {
    shareBtn.onclick = (e) => {
      e.preventDefault();
      if (navigator.share) {
        navigator.share({
          title: `AllergyFree - ${product.name}`,
          text: `${product.name} 알레르기 분석 결과 확인하기`,
          url: window.location.href
        }).catch(err => console.error(err));
      } else {
        navigator.clipboard.writeText(window.location.href);
        alert('분석 결과 링크가 클립보드에 복사되었습니다.');
      }
    };
  }

  loadScanAlternatives(product, userAllergies);
}

async function loadScanAlternatives(currentProduct, userAllergies = []) {
  const container = document.getElementById('scan-alternatives-container');
  if (!container) return;

  try {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) {
      throw new Error('대체 상품 목록 로드 실패');
    }
    const allProducts = await response.json();

    const otherProducts = allProducts.filter(p => p.barcode !== currentProduct.barcode);

    const safeProducts = otherProducts.filter(p => {
      const matched = p.allergens.filter(al => {
        return userAllergies.some(ua => ua === al.display_name || ua.toLowerCase() === al.name.toLowerCase());
      });
      return matched.length === 0;
    });

    const currentGroup = currentProduct.alternative_group;
    const currentCategory = currentProduct.category_name || currentProduct.category_id;
    
    safeProducts.sort((a, b) => {
      if (currentGroup) {
        const aSameGroup = a.alternative_group === currentGroup ? 1 : 0;
        const bSameGroup = b.alternative_group === currentGroup ? 1 : 0;
        if (aSameGroup !== bSameGroup) {
          return bSameGroup - aSameGroup;
        }
      }
      const currentHasMilk = currentProduct.allergens.some(al => al.name === 'milk');
      if (!currentHasMilk) {
        const aHasMilk = a.allergens.some(al => al.name === 'milk') ? 1 : 0;
        const bHasMilk = b.allergens.some(al => al.name === 'milk') ? 1 : 0;
        if (aHasMilk !== bHasMilk) {
          return aHasMilk - bHasMilk;
        }
      }
      const aSameCat = (a.category_name || a.category_id) === currentCategory ? 1 : 0;
      const bSameCat = (b.category_name || b.category_id) === currentCategory ? 1 : 0;
      return bSameCat - aSameCat;
    });

    // Group/Deduplicate by base name to avoid multiple sizes of the same product
    const seenBaseNames = new Set();
    const currentBaseName = extractBaseName(currentProduct.name);
    seenBaseNames.add(currentBaseName);

    const uniqueSafeProducts = [];
    for (const p of safeProducts) {
      const base = extractBaseName(p.name);
      if (!seenBaseNames.has(base)) {
        seenBaseNames.add(base);
        uniqueSafeProducts.push(p);
      }
    }

    const recommended = uniqueSafeProducts.slice(0, 4);

    container.innerHTML = '';

    if (recommended.length === 0) {
      container.innerHTML = '<p class="col-span-full text-center text-on-surface-variant font-body-sm py-lg">추천 가능한 안전한 대체 상품이 없습니다.</p>';
      return;
    }

    recommended.forEach(item => {
      const card = document.createElement('div');
      card.className = "min-w-[200px] bg-white p-md rounded-xl border border-outline-variant/30 shadow-sm group cursor-pointer hover:border-primary transition-all duration-200 flex flex-col justify-between active:scale-95";
      
      const formattedPrice = item.price ? `₩${Number(item.price).toLocaleString()}` : '가격 정보 없음';

      card.innerHTML = `
        <div onclick="window.location.href='/scan?barcode=${item.barcode}'">
          <div class="relative rounded-lg overflow-hidden h-32 bg-[#f4fbf4] flex items-center justify-center mb-sm">
            <img loading="lazy" alt="${item.name}" class="max-h-full max-w-full object-contain group-hover:scale-105 transition-all duration-300" src="${item.image_url || ''}"/>
            <div class="absolute top-2 right-2 bg-[#24d27a] text-white p-1 rounded-full w-6 h-6 flex items-center justify-center shadow-sm">
              <span class="material-symbols-outlined text-[16px] font-bold" data-weight="fill">check</span>
            </div>
          </div>
          <p class="text-[10px] text-outline truncate">${item.brand || ''}</p>
          <h4 class="text-body-sm font-bold text-on-surface truncate mt-0.5">${item.name}</h4>
          <p class="text-label-sm font-semibold text-[#0f683d] mt-1">${formattedPrice}</p>
        </div>
      `;
      container.appendChild(card);
    });
  } catch (err) {
    console.error(err);
  }
}

// =========================================================================
// Shopping Cart Functions (localStorage-based)
// =========================================================================

function getCart() {
  try {
    return JSON.parse(localStorage.getItem('cart') || '[]');
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartBadges();
}

function addToCart(item) {
  const cart = getCart();
  const existing = cart.find(x => x.barcode === item.barcode);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...item, quantity: 1 });
  }
  saveCart(cart);
}

function removeFromCart(barcode) {
  let cart = getCart();
  cart = cart.filter(x => x.barcode !== barcode);
  saveCart(cart);
}

function updateQuantity(barcode, delta) {
  const cart = getCart();
  const item = cart.find(x => x.barcode === barcode);
  if (item) {
    item.quantity += delta;
    if (item.quantity <= 0) {
      removeFromCart(barcode);
    } else {
      saveCart(cart);
    }
  }
}

function clearCart() {
  saveCart([]);
}

function updateCartBadges() {
  const cart = getCart();
  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
  const badges = document.querySelectorAll('#cart-badge');
  badges.forEach(badge => {
    badge.textContent = totalQty;
    if (totalQty > 0) {
      badge.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
    }
  });
}

function showCartToast() {
  const existing = document.getElementById('cart-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'cart-toast';
  toast.style.cssText = `
    position: fixed;
    bottom: 90px;
    left: 50%;
    transform: translateX(-50%) translateY(20px);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: var(--md-sys-color-surface-container-highest, #363636);
    color: var(--md-sys-color-on-surface, #ffffff);
    padding: 12px 16px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.1);
    width: 90%;
    max-width: 380px;
    opacity: 0;
    transition: opacity 0.3s ease, transform 0.3s ease;
  `;

  if (window.innerWidth >= 768) {
    toast.style.bottom = '24px';
    toast.style.left = 'auto';
    toast.style.right = '24px';
    toast.style.transform = 'translateY(20px)';
  }

  toast.innerHTML = `
    <div style="display: flex; align-items: center; gap: 8px;">
      <span class="material-symbols-outlined" style="color: var(--md-sys-color-primary, #a8c7fa);">shopping_cart</span>
      <span style="font-size: 14px; font-weight: 500;">장바구니에 추가되었습니다.</span>
    </div>
    <a href="/cart" style="color: var(--md-sys-color-primary, #a8c7fa); font-size: 14px; font-weight: bold; text-decoration: none; margin-left: 12px;">장바구니 확인하기</a>
  `;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '1';
    if (window.innerWidth >= 768) {
      toast.style.transform = 'translateY(0)';
    } else {
      toast.style.transform = 'translateX(-50%) translateY(0)';
    }
  }, 50);

  setTimeout(() => {
    toast.style.opacity = '0';
    if (window.innerWidth >= 768) {
      toast.style.transform = 'translateY(20px)';
    } else {
      toast.style.transform = 'translateX(-50%) translateY(20px)';
    }
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

function initCart() {
  updateCartBadges();

  // Bind Shop product cards
  const productCards = document.querySelectorAll('.product-card');
  productCards.forEach(card => {
    const barcode = card.getAttribute('data-barcode');
    const name = card.getAttribute('data-name');
    const brand = card.getAttribute('data-brand');
    const image = card.getAttribute('data-image');
    const price = parseInt(card.getAttribute('data-price') || '0', 10);

    // Card click leads to detail page
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-id');
      if (id) {
        window.location.href = `/shop_food?id=${id}`;
      } else {
        window.location.href = `/shop_food?barcode=${barcode}`;
      }
    });

    // Cart button click stops propagation and adds to cart
    const cartBtn = card.querySelector('.add-to-cart-btn');
    if (cartBtn) {
      cartBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!localStorage.getItem('token')) {
          openModal();
          return;
        }
        addToCart({ barcode, name, brand, image, price });
        showCartToast();
      });
    }
  });

  // Bind Shop Detail page buttons
  const detailCartBtn = document.getElementById('add-to-cart-detail-btn');
  const detailBuyBtn = document.getElementById('quick-buy-detail-btn');

  const handleDetailAction = (btn, redirectToCart = false) => {
    if (!btn) return;
    btn.addEventListener('click', () => {
      if (!localStorage.getItem('token')) {
        openModal();
        return;
      }
      
      const isUnsafe = btn.getAttribute('data-unsafe') === 'true';
      if (isUnsafe) {
        const allergens = btn.getAttribute('data-allergens');
        const confirmMsg = `⚠️ 경고: 이 상품은 회원님의 알레르기 유발 물질(${allergens})을 포함하고 있습니다. 그래도 추가하시겠습니까?`;
        if (!confirm(confirmMsg)) return;
      }

      const barcode = btn.getAttribute('data-barcode');
      const name = btn.getAttribute('data-name');
      const brand = btn.getAttribute('data-brand');
      const image = btn.getAttribute('data-image');
      const price = parseInt(btn.getAttribute('data-price') || '0', 10);

      addToCart({ barcode, name, brand, image, price });
      showCartToast();

      if (redirectToCart) {
        setTimeout(() => {
          window.location.href = '/cart';
        }, 300);
      }
    });
  };

  handleDetailAction(detailCartBtn, false);
  handleDetailAction(detailBuyBtn, true);
}

// 5. Cart Page Controller
function initCartPage(userAllergies = []) {
  const cart = getCart();
  const itemsContainer = document.getElementById('cart-items-container');
  const emptyState = document.getElementById('cart-empty-state');
  const summarySection = document.getElementById('cart-summary-section');
  const warningSection = document.getElementById('cart-allergy-warning');
  const warningText = document.getElementById('cart-allergy-warning-text');
  const totalPriceEl = document.getElementById('cart-total-price');

  if (cart.length === 0) {
    if (itemsContainer) itemsContainer.innerHTML = '';
    if (emptyState) emptyState.classList.remove('hidden');
    if (summarySection) summarySection.classList.add('hidden');
    if (warningSection) warningSection.classList.add('hidden');
    return;
  }

  if (emptyState) emptyState.classList.add('hidden');
  if (summarySection) summarySection.classList.remove('hidden');

  // Let's compute matching allergies for each cart item
  const PRODUCT_ALLERGENS = {
    '8809999999001': ['견과류'],
    '8809999999002': ['밀'],
    '8809999999003': ['우유', '땅콩', '견과류'],
    '8809999999004': [],
    '8809999999005': ['땅콩', '견과류'],
    '8809999999006': ['해산물']
  };

  let hasCartAllergy = false;
  let allergicProductNames = [];
  let totalPrice = 0;

  if (itemsContainer) {
    itemsContainer.innerHTML = '';

    cart.forEach(item => {
      totalPrice += item.price * item.quantity;
      
      const itemAllergens = PRODUCT_ALLERGENS[item.barcode] || [];
      const matched = itemAllergens.filter(x => userAllergies.includes(x));
      const isDangerous = matched.length > 0;

      if (isDangerous) {
        hasCartAllergy = true;
        allergicProductNames.push(`${item.name} (${matched.join(', ')})`);
      }

      const itemCard = document.createElement('div');
      itemCard.className = "bg-surface-container-lowest p-md rounded-xl border border-outline-variant/30 shadow-sm flex items-center justify-between gap-md";
      
      itemCard.innerHTML = `
        <div class="flex items-center gap-md flex-1 min-w-0">
          <img class="w-16 h-16 object-cover rounded-lg bg-surface-container-high shrink-0" src="${item.image || '/images/default.jpg'}" alt="${item.name}"/>
          <div class="flex-1 min-w-0">
            <span class="text-label-sm text-outline">${item.brand}</span>
            <h3 class="font-label-lg text-on-surface truncate">${item.name}</h3>
            <span class="text-primary font-bold text-body-md">₩${(item.price * item.quantity).toLocaleString()}</span>
            ${isDangerous ? `
              <div class="mt-xs flex items-center gap-xs text-error font-label-sm bg-error-container/30 px-sm py-1 rounded-lg border border-error/25">
                <span class="material-symbols-outlined text-[14px]">warning</span>
                <span>알레르기 성분 [${matched.join(', ')}] 포함!</span>
              </div>
            ` : ''}
          </div>
        </div>
        <div class="flex flex-col items-end gap-sm shrink-0">
          <button class="remove-item-btn text-outline hover:text-error transition-colors p-1 rounded-full hover:bg-surface-container-high" data-barcode="${item.barcode}">
            <span class="material-symbols-outlined text-[20px]">delete</span>
          </button>
          <div class="flex items-center border border-outline rounded-lg bg-surface-container-low overflow-hidden">
            <button class="qty-btn-minus px-2 py-1 hover:bg-surface-container-high active:scale-90 transition-transform font-bold text-label-lg" data-barcode="${item.barcode}">-</button>
            <span class="px-sm text-body-md font-bold">${item.quantity}</span>
            <button class="qty-btn-plus px-2 py-1 hover:bg-surface-container-high active:scale-90 transition-transform font-bold text-label-lg" data-barcode="${item.barcode}">+</button>
          </div>
        </div>
      `;

      itemsContainer.appendChild(itemCard);
    });

    // Add listeners to item actions
    itemsContainer.querySelectorAll('.remove-item-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const barcode = btn.getAttribute('data-barcode');
        removeFromCart(barcode);
        initCartPage(userAllergies);
      });
    });

    itemsContainer.querySelectorAll('.qty-btn-minus').forEach(btn => {
      btn.addEventListener('click', () => {
        const barcode = btn.getAttribute('data-barcode');
        updateQuantity(barcode, -1);
        initCartPage(userAllergies);
      });
    });

    itemsContainer.querySelectorAll('.qty-btn-plus').forEach(btn => {
      btn.addEventListener('click', () => {
        const barcode = btn.getAttribute('data-barcode');
        updateQuantity(barcode, 1);
        initCartPage(userAllergies);
      });
    });
  }

  // Update warnings
  if (hasCartAllergy) {
    if (warningSection) warningSection.classList.remove('hidden');
    if (warningText) {
      warningText.innerHTML = `
        장바구니 상품 중 회원님의 알레르기 유발 성분이 포함되어 있습니다:<br/>
        <strong class="text-error">${allergicProductNames.join(', ')}</strong><br/>
        안전을 위해 이 식품들의 섭취 및 구매를 삼가해 주시기 바랍니다.
      `;
    }
  } else {
    if (warningSection) warningSection.classList.add('hidden');
  }

  // Update total price
  if (totalPriceEl) {
    totalPriceEl.textContent = `₩${totalPrice.toLocaleString()}`;
  }

  // Setup order checkout button click
  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) {
    const newBtn = checkoutBtn.cloneNode(true);
    checkoutBtn.parentNode.replaceChild(newBtn, checkoutBtn);

    newBtn.addEventListener('click', async () => {
      if (hasCartAllergy) {
        const confirmMsg = `⚠️ 경고: 장바구니에 회원님의 알레르기 유발 성분(${allergicProductNames.join(', ')})이 포함된 상품이 있습니다. 정말 주문하시겠습니까?\n\n이로 인한 알레르기 반응은 AllergyFree가 책임지지 않습니다.`;
        if (!confirm(confirmMsg)) {
          return;
        }
        if (!confirm("알레르기 경고를 무시하고 정말로 구매를 완료하시겠습니까?")) {
          return;
        }
      }

      const token = localStorage.getItem('token');
      if (!token) {
        alert('로그인이 만료되었거나 로그인이 필요한 서비스입니다.');
        openModal();
        return;
      }

      newBtn.disabled = true;
      newBtn.textContent = '주문 처리 중...';

      try {
        const orderItems = cart.map(x => ({
          barcode: x.barcode,
          quantity: x.quantity
        }));

        const response = await fetch(`${API_URL}/orders`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ items: orderItems })
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.message || '주문 요청 처리에 실패했습니다.');
        }

        alert('🎉 주문이 정상적으로 완료되었습니다!');
        clearCart();
        window.location.href = '/';
      } catch (err) {
        console.error(err);
        alert(`주문 실패: ${err.message}`);
        newBtn.disabled = false;
        newBtn.innerHTML = `
          주문하기 (결제)
          <span class="material-symbols-outlined">shopping_bag</span>
        `;
      }
    });
  }
}

function saveLastClickedProduct(product, userAllergies = []) {
  // Check if status is safe
  const matched = (product.allergens || []).filter(al => {
    return userAllergies.some(ua => ua === al.display_name || ua.toLowerCase() === al.name.toLowerCase() || al.display_name.includes(ua) || ua.includes(al.display_name));
  });
  const isSafe = matched.length === 0;

  // We only store the product if it is a shop/seed registered product AND status === 'safe'
  if ((product.source !== 'shop' && product.source !== 'seed') || !isSafe) {
    return;
  }

  const productData = {
    id: product.id,
    barcode: product.barcode,
    name: product.name,
    brand: product.brand,
    image_url: product.image_url || product.image || '',
    price: product.price,
    source: product.source,
    allergens: product.allergens || []
  };
  localStorage.setItem('lastClickedProduct', JSON.stringify(productData));

  // Update viewed history list
  let history = [];
  const storedHistory = localStorage.getItem('viewedProductsHistory');
  if (storedHistory) {
    try {
      history = JSON.parse(storedHistory);
    } catch(e) {
      console.error(e);
    }
  }

  if (!Array.isArray(history)) {
    history = [];
  }

  // Remove existing occurrence (deduplicate) to place it on top of the stack
  history = history.filter(x => x.id !== product.id && x.barcode !== product.barcode);
  history.unshift(productData);

  // Persisted in localStorage
  localStorage.setItem('viewedProductsHistory', JSON.stringify(history));
}

function initHomePage(userAllergies = []) {
  const container = document.getElementById('recent-safe-food-container');
  if (!container) return;

  // Load recommended recipes first so it's not blocked by empty history early return
  loadRecommendedRecipes(userAllergies);

  let history = [];
  const storedHistory = localStorage.getItem('viewedProductsHistory');
  if (storedHistory) {
    try {
      history = JSON.parse(storedHistory);
    } catch (e) {
      console.error(e);
    }
  }

  // Filter out non-shop or unsafe items to clean up legacy data
  if (Array.isArray(history) && history.length > 0) {
    const originalLength = history.length;
    history = history.filter(product => {
      if (product.source !== 'shop' && product.source !== 'seed') return false;
      const itemAllergens = product.allergens ? product.allergens.map(a => a.display_name) : [];
      const matched = itemAllergens.filter(x => {
        return userAllergies.some(ua => ua === x || ua.includes(x) || x.includes(ua));
      });
      return matched.length === 0;
    });
    if (history.length !== originalLength) {
      localStorage.setItem('viewedProductsHistory', JSON.stringify(history));
    }
  }

  const moreLink = document.getElementById('recent-safe-food-more-link');
  if (moreLink) {
    if (history.length >= 5) {
      moreLink.classList.remove('hidden');
    } else {
      moreLink.classList.add('hidden');
    }
  }

  if (!Array.isArray(history) || history.length === 0) {
    container.innerHTML = `
      <div class="w-full text-center py-md text-on-surface-variant font-body-sm border border-dashed border-outline-variant/60 rounded-xl bg-surface-container-low p-md">
        최근 본 안전 식품이 없습니다. 상품을 탐색해 보세요!
      </div>
    `;
    return;
  }

  const PRODUCT_ALLERGENS = {
    '8809999999001': ['견과류'],
    '8809999999002': ['밀'],
    '8809999999003': ['우유', '땅콩', '견과류'],
    '8809999999004': [],
    '8809999999005': ['땅콩', '견과류'],
    '8809999999006': ['해산물']
  };

  container.innerHTML = '';
  const displayItems = history.slice(0, 5);

  displayItems.forEach(product => {
    const itemAllergens = product.allergens ? product.allergens.map(a => a.display_name) : (PRODUCT_ALLERGENS[product.barcode] || []);
    const matched = itemAllergens.filter(x => {
      return userAllergies.some(ua => ua === x || ua.includes(x) || x.includes(ua));
    });
    const isSafe = matched.length === 0;

    const card = document.createElement('div');
    card.className = "flex-none w-40 bg-surface-container-lowest rounded-lg p-sm border border-outline-variant shadow-sm cursor-pointer hover:shadow-md transition-shadow flex flex-col justify-between";
    card.onclick = () => window.location.href = `/shop_food?id=${product.id}`;
    card.innerHTML = `
      <div>
        <div class="relative mb-xs">
          <img loading="lazy" class="w-full aspect-square object-contain rounded bg-surface-container-high" src="${product.image_url || '/images/default.jpg'}" alt="${product.name}"/>
          ${isSafe ? `
            <span class="absolute top-xs right-xs bg-primary text-on-primary text-[10px] font-bold px-sm py-0.5 rounded-full flex items-center gap-0.5 shadow-sm">
              <span class="material-symbols-outlined text-[10px]">check</span>
              안전
            </span>
          ` : `
            <span class="absolute top-xs right-xs bg-error text-on-error text-[10px] font-bold px-sm py-0.5 rounded-full flex items-center gap-0.5 shadow-sm">
              <span class="material-symbols-outlined text-[10px]">warning</span>
              위험
            </span>
          `}
        </div>
        <span class="text-label-sm text-outline">${product.brand}</span>
        <h3 class="font-label-lg text-on-surface truncate">${product.name}</h3>
      </div>
      <p class="font-label-sm ${isSafe ? 'text-primary' : 'text-error'} flex items-center gap-xs mt-sm">
        <span class="material-symbols-outlined text-[12px]">${isSafe ? 'check_circle' : 'cancel'}</span>
        ${isSafe ? '검증 완료' : `섭취 주의 (${matched.join(', ')})`}
      </p>
    `;
    container.appendChild(card);
  });
}

function initViewedProductsPage(userAllergies = []) {
  const container = document.getElementById('viewed-products-grid');
  const emptyState = document.getElementById('viewed-products-empty-state');
  if (!container) return;

  let history = [];
  const storedHistory = localStorage.getItem('viewedProductsHistory');
  if (storedHistory) {
    try {
      history = JSON.parse(storedHistory);
    } catch(e) {
      console.error(e);
    }
  }

  // Filter out non-shop or unsafe items to clean up legacy data
  if (Array.isArray(history) && history.length > 0) {
    const originalLength = history.length;
    history = history.filter(product => {
      if (product.source !== 'shop' && product.source !== 'seed') return false;
      const itemAllergens = product.allergens ? product.allergens.map(a => a.display_name) : [];
      const matched = itemAllergens.filter(x => {
        return userAllergies.some(ua => ua === x || ua.includes(x) || x.includes(ua));
      });
      return matched.length === 0;
    });
    if (history.length !== originalLength) {
      localStorage.setItem('viewedProductsHistory', JSON.stringify(history));
    }
  }

  if (!Array.isArray(history) || history.length === 0) {
    if (container) container.innerHTML = '';
    if (emptyState) emptyState.classList.remove('hidden');
    return;
  }

  if (emptyState) emptyState.classList.add('hidden');
  container.innerHTML = '';

  const PRODUCT_ALLERGENS = {
    '8809999999001': ['견과류'],
    '8809999999002': ['밀'],
    '8809999999003': ['우유', '땅콩', '견과류'],
    '8809999999004': [],
    '8809999999005': ['땅콩', '견과류'],
    '8809999999006': ['해산물']
  };

  history.forEach(product => {
    const itemAllergens = product.allergens ? product.allergens.map(a => a.display_name) : (PRODUCT_ALLERGENS[product.barcode] || []);
    const matched = itemAllergens.filter(x => {
      return userAllergies.some(ua => ua === x || ua.includes(x) || x.includes(ua));
    });
    const isSafe = matched.length === 0;

    const card = document.createElement('div');
    card.className = "bg-surface-container-lowest rounded-lg p-sm border border-outline-variant shadow-sm cursor-pointer hover:shadow-md transition-shadow flex flex-col justify-between";
    card.onclick = () => window.location.href = `/shop_food?id=${product.id}`;
    card.innerHTML = `
      <div>
        <div class="relative mb-xs">
          <img loading="lazy" class="w-full aspect-square object-contain rounded bg-surface-container-high" src="${product.image_url || '/images/default.jpg'}" alt="${product.name}"/>
          ${isSafe ? `
            <span class="absolute top-xs right-xs bg-primary text-on-primary text-[10px] font-bold px-sm py-0.5 rounded-full flex items-center gap-0.5 shadow-sm">
              <span class="material-symbols-outlined text-[10px]">check</span>
              안전
            </span>
          ` : `
            <span class="absolute top-xs right-xs bg-error text-on-error text-[10px] font-bold px-sm py-0.5 rounded-full flex items-center gap-0.5 shadow-sm">
              <span class="material-symbols-outlined text-[10px]">warning</span>
              위험
            </span>
          `}
        </div>
        <span class="text-label-sm text-outline">${product.brand}</span>
        <h3 class="font-label-lg text-on-surface truncate">${product.name}</h3>
      </div>
      <p class="font-label-sm ${isSafe ? 'text-primary' : 'text-error'} flex items-center gap-xs mt-sm">
        <span class="material-symbols-outlined text-[12px]">${isSafe ? 'check_circle' : 'cancel'}</span>
        ${isSafe ? '검증 완료' : `섭취 주의 (${matched.join(', ')})`}
      </p>
    `;
    container.appendChild(card);
  });
}

async function initProfileEditPage(userData = null) {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('로그인이 필요한 페이지입니다. 홈으로 이동합니다.');
    window.location.href = '/';
    return;
  }

  let user = userData;
  if (!user) {
    try {
      const response = await fetch(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        user = await response.json();
      } else {
        throw new Error('Failed to fetch user');
      }
    } catch (e) {
      console.error(e);
      alert('사용자 정보를 불러올 수 없습니다.');
      window.location.href = '/profile';
      return;
    }
  }

  // Pre-populate fields
  if (document.getElementById('edit-username')) document.getElementById('edit-username').value = user.username || '';
  if (document.getElementById('edit-email')) document.getElementById('edit-email').value = user.email || '';
  if (document.getElementById('edit-name')) document.getElementById('edit-name').value = user.name || '';
  if (document.getElementById('edit-phone')) document.getElementById('edit-phone').value = user.phone || '';
  if (document.getElementById('edit-birthdate')) document.getElementById('edit-birthdate').value = user.birthdate || '';
  if (document.getElementById('edit-gender')) document.getElementById('edit-gender').value = user.gender || '';
  if (document.getElementById('edit-recipient-name')) document.getElementById('edit-recipient-name').value = user.recipient_name || '';
  if (document.getElementById('edit-address')) document.getElementById('edit-address').value = user.address || '';
  if (document.getElementById('edit-detail-address')) document.getElementById('edit-detail-address').value = user.detail_address || '';
  if (document.getElementById('edit-zipcode')) document.getElementById('edit-zipcode').value = user.zipcode || '';
  if (document.getElementById('edit-contact-phone')) document.getElementById('edit-contact-phone').value = user.contact_phone || '';

  // Form submission
  const editForm = document.getElementById('profile-edit-form');
  const errorDiv = document.getElementById('profile-edit-error');
  const successDiv = document.getElementById('profile-edit-success');

  if (editForm) {
    editForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (errorDiv) errorDiv.classList.add('hidden');
      if (successDiv) successDiv.classList.add('hidden');

      const email = document.getElementById('edit-email').value.trim();
      const currentPassword = document.getElementById('edit-current-password').value;
      const newPassword = document.getElementById('edit-new-password').value;
      const confirmPassword = document.getElementById('edit-confirm-password').value;
      const name = document.getElementById('edit-name').value.trim();
      const phone = document.getElementById('edit-phone').value.trim();
      const birthdate = document.getElementById('edit-birthdate').value || undefined;
      const gender = document.getElementById('edit-gender').value || undefined;
      const recipient_name = document.getElementById('edit-recipient-name').value.trim() || undefined;
      const address = document.getElementById('edit-address').value.trim() || undefined;
      const detail_address = document.getElementById('edit-detail-address').value.trim() || undefined;
      const zipcode = document.getElementById('edit-zipcode').value.trim() || undefined;
      const contact_phone = document.getElementById('edit-contact-phone').value.trim() || undefined;

      if (currentPassword || newPassword || confirmPassword) {
        if (!currentPassword) {
          if (errorDiv) {
            errorDiv.innerText = '비밀번호를 변경하려면 기존 비밀번호를 입력해야 합니다.';
            errorDiv.classList.remove('hidden');
          }
          return;
        }
        if (!newPassword || newPassword.trim().length < 6) {
          if (errorDiv) {
            errorDiv.innerText = '새로운 비밀번호는 최소 6자 이상이어야 합니다.';
            errorDiv.classList.remove('hidden');
          }
          return;
        }
        if (newPassword !== confirmPassword) {
          if (errorDiv) {
            errorDiv.innerText = '새로운 비밀번호와 재입력 비밀번호가 일치하지 않습니다.';
            errorDiv.classList.remove('hidden');
          }
          return;
        }
      }

      const updateData = {
        email, 
        currentPassword: currentPassword || undefined,
        newPassword: newPassword || undefined, 
        name, phone,
        birthdate, gender, recipient_name, address,
        detail_address, zipcode, contact_phone
      };

      try {
        const res = await fetch(`${API_URL}/users/profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(updateData)
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || '정보 수정에 실패했습니다.');
        }

        if (successDiv) {
          successDiv.innerText = '회원 정보가 성공적으로 수정되었습니다! 잠시 후 프로필로 이동합니다.';
          successDiv.classList.remove('hidden');
        }
        
        setTimeout(() => {
          window.location.href = '/profile';
        }, 1500);

      } catch (err) {
        if (errorDiv) {
          errorDiv.innerText = err.message;
          errorDiv.classList.remove('hidden');
        }
      }
    });
  }
}

const allergenReplacements = {
  '우유': {
    keywords: ['우유', '생크림', '버터', '치즈', '밀크', '탈지분유', '전지분유'],
    replaceWith: '두유',
    msg: '우유(유제품)가 두유로 대체되었습니다.'
  },
  '난류(계란)': {
    keywords: ['계란', '달걀', '메추리알', '난황', '난백', '전란액'],
    replaceWith: '두부',
    msg: '계란이 두부로 대체되었습니다.'
  },
  '계란': {
    keywords: ['계란', '달걀', '메추리알', '난황', '난백', '전란액'],
    replaceWith: '두부',
    msg: '계란이 두부로 대체되었습니다.'
  },
  '밀': {
    keywords: ['밀가루', '밀', '소맥분', '소맥'],
    replaceWith: '쌀가루',
    msg: '밀가루가 쌀가루로 대체되었습니다.'
  },
  '땅콩': {
    keywords: ['땅콩', '피넛'],
    replaceWith: '아몬드',
    msg: '땅콩이 아몬드로 대체되었습니다.'
  },
  '대두': {
    keywords: ['대두', '콩', '두부', '두유'],
    replaceWith: '완두콩',
    msg: '대두(콩)가 완두콩으로 대체되었습니다.'
  },
  '새우': {
    keywords: ['새우'],
    replaceWith: '곤약',
    msg: '새우가 곤약으로 대체되었습니다.'
  },
  '게': {
    keywords: ['게', '꽃게'],
    replaceWith: '느타리버섯',
    msg: '게가 느타리버섯으로 대체되었습니다.'
  },
  '쇠고기': {
    keywords: ['소고기', '쇠고기'],
    replaceWith: '표고버섯',
    msg: '소고기가 표고버섯으로 대체되었습니다.'
  },
  '돼지고기': {
    keywords: ['돼지고기', '돈육'],
    replaceWith: '두부',
    msg: '돼지고기가 두부로 대체되었습니다.'
  },
  '닭고기': {
    keywords: ['닭고기', '계육'],
    replaceWith: '두부',
    msg: '닭고기가 두부로 대체되었습니다.'
  },
  '오징어': {
    keywords: ['오징어'],
    replaceWith: '새송이버섯',
    msg: '오징어가 새송이버섯으로 대체되었습니다.'
  },
  '호두': {
    keywords: ['호두'],
    replaceWith: '해바라기씨',
    msg: '호두가 해바라기씨로 대체되었습니다.'
  },
  '토마토': {
    keywords: ['토마토'],
    replaceWith: '파프리카',
    msg: '토마토가 파프리카로 대체되었습니다.'
  }
};

const FALLBACK_RECIPES = [
  {
    RCP_SEQ: "90001",
    RCP_NM: "새우 두부 계란찜",
    RCP_WAY2: "찌기",
    RCP_PAT2: "반찬",
    ATT_FILE_NO_MAIN: "https://lh3.googleusercontent.com/aida-public/AB6AXuAhVDUQVmKFs4UmdLjdSMaJmClSwMHji-ebX7IvgpJpNMw6ey5emCNu0KYg4a6ZpaSm7-zsoHbmtW7TAlbPfslbZ9hZp0Iu-ltvgBmmIkBIOUB2tOANND3OyJ-zr2KGViMnL3A16bS2CfS3sMcqoguqHjI3p5_e-yAdehkQIzrsBhgIvjJpD8apILCUpv6rbvfSG3tEsfsum4gTyTbDVEKqEuBx3j6ofwIzR1L0IPApmwdpt5a13JMweH3qYca1mVtq51p__A-UjeA",
    ATT_FILE_NO_MK: "https://lh3.googleusercontent.com/aida-public/AB6AXuAhVDUQVmKFs4UmdLjdSMaJmClSwMHji-ebX7IvgpJpNMw6ey5emCNu0KYg4a6ZpaSm7-zsoHbmtW7TAlbPfslbZ9hZp0Iu-ltvgBmmIkBIOUB2tOANND3OyJ-zr2KGViMnL3A16bS2CfS3sMcqoguqHjI3p5_e-yAdehkQIzrsBhgIvjJpD8apILCUpv6rbvfSG3tEsfsum4gTyTbDVEKqEuBx3j6ofwIzR1L0IPApmwdpt5a13JMweH3qYca1mVtq51p__A-UjeA",
    RCP_PARTS_DTLS: "칵테일새우 50g, 연두부 100g, 계란 2개, 우유 50ml, 참기름 1작은술, 대파 10g",
    INFO_ENG: "185",
    INFO_CAR: "4",
    INFO_PRO: "12",
    INFO_FAT: "11",
    INFO_NA: "120",
    RCP_NA_TIP: "소금 대신 새우 자체의 짠맛을 이용해 간을 하여 나트륨 섭취를 최소화합니다.",
    MANUAL01: "1. 칵테일새우는 깨끗이 씻어 물기를 제거합니다.",
    MANUAL02: "2. 그릇에 계란을 풀고 우유와 참기름을 섞은 후, 체에 걸러 부드럽게 만듭니다.",
    MANUAL03: "3. 연두부와 새우를 찜용 그릇에 깔고 계란물을 체에 받쳐 부어줍니다.",
    MANUAL04: "4. 찜기에 물이 끓으면 그릇을 넣고 약불에서 12분간 쪄줍니다. 다진 파를 얹어 마무리합니다."
  },
  {
    RCP_SEQ: "90002",
    RCP_NM: "소고기 버섯 채소 볶음",
    RCP_WAY2: "볶기",
    RCP_PAT2: "반찬",
    ATT_FILE_NO_MAIN: "https://lh3.googleusercontent.com/aida-public/AB6AXuCwb3j7LFvXZ-MzRaIxv0pmBf33p7BQWO6pK_Jw75P8b-jAuxLDVTF7JUmJhDwshOeah-Z5Z85ntQSBXIS7C-oItBqDwaGwzArQoP6QHrUSGFVkftHz-Y98JxnnLZjPosWz2y1Z-s6JSgPCpJ1lC1kbcRb4I_91Pp1tAz1Z_Dx7wX1NH4Xa6xLfW-WQmf3CtqNk31iQSbeCds4meIwTa9hCO0VHsILz25n5wUMZFB9Iqp2uakqZblrDH4UP5nXC6j2XTpHEnv1VoxU",
    ATT_FILE_NO_MK: "https://lh3.googleusercontent.com/aida-public/AB6AXuCwb3j7LFvXZ-MzRaIxv0pmBf33p7BQWO6pK_Jw75P8b-jAuxLDVTF7JUmJhDwshOeah-Z5Z85ntQSBXIS7C-oItBqDwaGwzArQoP6QHrUSGFVkftHz-Y98JxnnLZjPosWz2y1Z-s6JSgPCpJ1lC1kbcRb4I_91Pp1tAz1Z_Dx7wX1NH4Xa6xLfW-WQmf3CtqNk31iQSbeCds4meIwTa9hCO0VHsILz25n5wUMZFB9Iqp2uakqZblrDH4UP5nXC6j2XTpHEnv1VoxU",
    RCP_PARTS_DTLS: "쇠고기(등심) 150g, 표고버섯 50g, 파프리카 50g, 브로콜리 30g, 간장 1큰술, 다진 마늘 1작은술, 참기름 1작은술",
    INFO_ENG: "310",
    INFO_CAR: "8",
    INFO_PRO: "24",
    INFO_FAT: "18",
    INFO_NA: "350",
    RCP_NA_TIP: "소금 대신 마늘과 참기름의 고소한 맛을 살려 볶아냅니다.",
    MANUAL01: "1. 쇠고기는 한입 크기로 썰고 참기름과 마늘로 밑간을 해 둡니다.",
    MANUAL02: "2. 표고버섯, 파프리카, 브로콜리는 씻어서 먹기 좋은 크기로 슬라이스합니다.",
    MANUAL03: "3. 달궈진 팬에 고기를 먼저 볶아 익힌 후 준비된 버섯과 채소를 함께 넣습니다.",
    MANUAL04: "4. 재료들이 잘 어우러지면 간장 한 술을 넣어 센 불에서 빠르게 볶아 마무리합니다."
  },
  {
    RCP_SEQ: "90003",
    RCP_NM: "초코 칩 쿠키",
    RCP_WAY2: "굽기",
    RCP_PAT2: "후식",
    ATT_FILE_NO_MAIN: "https://lh3.googleusercontent.com/aida-public/AB6AXuBkNB7Klbryy2iN5ALDZYZXhRNfBW1J8ozxK1hUJ8vJFgarCe-AD9_lvSL8W_Un3x-5QhRKPUWReXLDX-kqsqJbYJWUvPbxIOx6ohfkGXMZ-Fj8lkAL6DugL2jzhP6ABrJTe_ShNSim46C6N8KjZW06b4Edqz3m0hP-848JtgUMh42ATjODlaW3F6M00QRwvwkBv9iaFrbRwPJNXqS2QV36RiOxUCmFsijovMbzXphkegThf3pzCRRdz0MHPMM8Lxq89HsrITKnKXY",
    ATT_FILE_NO_MK: "https://lh3.googleusercontent.com/aida-public/AB6AXuBkNB7Klbryy2iN5ALDZYZXhRNfBW1J8ozxK1hUJ8vJFgarCe-AD9_lvSL8W_Un3x-5QhRKPUWReXLDX-kqsqJbYJWUvPbxIOx6ohfkGXMZ-Fj8lkAL6DugL2jzhP6ABrJTe_ShNSim46C6N8KjZW06b4Edqz3m0hP-848JtgUMh42ATjODlaW3F6M00QRwvwkBv9iaFrbRwPJNXqS2QV36RiOxUCmFsijovMbzXphkegThf3pzCRRdz0MHPMM8Lxq89HsrITKnKXY",
    RCP_PARTS_DTLS: "밀가루(박력분) 150g, 무염버터 80g, 설탕 60g, 계란 1개, 초코칩 50g, 땅콩가루 20g",
    INFO_ENG: "420",
    INFO_CAR: "54",
    INFO_PRO: "6",
    INFO_FAT: "22",
    INFO_NA: "95",
    RCP_NA_TIP: "무염버터와 건강한 곡물가루를 이용해 건강하게 쿠키를 구워냅니다.",
    MANUAL01: "1. 실온에 두어 부드러워진 무염버터에 설탕을 넣고 섞어 줍니다.",
    MANUAL02: "2. 버터 크림에 계란을 넣어 잘 섞어준 후 밀가루를 체 쳐서 넣습니다.",
    MANUAL03: "3. 반죽에 초코칩과 땅콩가루를 골고루 섞어 뭉쳐줍니다.",
    MANUAL04: "4. 오븐 팬에 숟가락으로 둥글게 팬닝한 후, 180도로 예열된 오븐에서 12분간 구워냅니다."
  }
];

function processAllergySubstitution(partsText, userAllergies) {
  let processedParts = partsText || '';
  let activeSubs = [];

  userAllergies.forEach(allergy => {
    let rule = allergenReplacements[allergy];
    if (!rule && allergy.includes('계란')) rule = allergenReplacements['계란'];
    if (!rule && allergy.includes('우유')) rule = allergenReplacements['우유'];
    if (!rule && allergy.includes('밀')) rule = allergenReplacements['밀'];
    if (!rule) return;

    let matchedKeyword = null;
    for (let kw of rule.keywords) {
      if (processedParts.includes(kw)) {
        matchedKeyword = kw;
        break;
      }
    }

    if (matchedKeyword) {
      rule.keywords.forEach(kw => {
        const regex = new RegExp(kw, 'g');
        processedParts = processedParts.replace(regex, rule.replaceWith);
      });
      if (!activeSubs.some(x => x.allergen === allergy)) {
        activeSubs.push({
          allergen: allergy,
          replacement: rule.replaceWith,
          msg: rule.msg
        });
      }
    }
  });

  return { processedParts, activeSubs };
}

async function loadRecommendedRecipes(userAllergies = []) {
  const container = document.getElementById('recommended-recipe-container');
  if (!container) return;

  // 1. Show shimmer skeleton loader placeholders immediately
  container.innerHTML = Array(3).fill(0).map(() => `
    <div class="bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant flex flex-col justify-between h-[300px]">
      <div>
        <div class="h-48 shimmer"></div>
        <div class="p-md space-y-sm">
          <div class="flex justify-between items-center gap-xs">
            <div class="h-6 w-2/3 bg-slate-200 dark:bg-slate-800 rounded shimmer"></div>
            <div class="h-6 w-1/4 bg-slate-200 dark:bg-slate-800 rounded-full shimmer"></div>
          </div>
          <div class="space-y-xs pt-1">
            <div class="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded shimmer"></div>
            <div class="h-4 w-5/6 bg-slate-200 dark:bg-slate-800 rounded shimmer"></div>
          </div>
        </div>
      </div>
      <div class="px-md pb-md flex gap-xs">
        <div class="h-6 w-16 bg-slate-200 dark:bg-slate-800 rounded shimmer"></div>
        <div class="h-6 w-16 bg-slate-200 dark:bg-slate-800 rounded shimmer"></div>
      </div>
    </div>
  `).join('');

  const startIdx = Math.floor(Math.random() * 90) + 1;
  const endIdx = startIdx + 3;
  const apiKey = "a221b8145b894fa99895";
  const url = `https://openapi.foodsafetykorea.go.kr/api/${apiKey}/COOKRCP01/json/${startIdx}/${endIdx}`;

  let recipes = [];

  // Add a slight intentional delay of 600ms to showcase the premium transition and avoid flashing
  const delayPromise = new Promise(resolve => setTimeout(resolve, 600));

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("HTTP error");
    const data = await res.json();
    if (data.COOKRCP01 && data.COOKRCP01.row && data.COOKRCP01.row.length > 0) {
      recipes = data.COOKRCP01.row.slice(0, 3);
    } else {
      throw new Error("No data in response");
    }
  } catch (e) {
    console.warn("Using fallback recipes due to API fetch error:", e.message);
    recipes = FALLBACK_RECIPES;
  }

  // Await the delay to ensure smooth loading transition
  await delayPromise;

  container.innerHTML = '';

  recipes.forEach(recipe => {
    sessionStorage.setItem('recipe_' + recipe.RCP_SEQ, JSON.stringify(recipe));

    const { processedParts, activeSubs } = processAllergySubstitution(recipe.RCP_PARTS_DTLS, userAllergies);

    const card = document.createElement('div');
    // Added 'fade-in-slide' class for smooth transition
    card.className = "fade-in-slide bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group cursor-pointer border border-outline-variant flex flex-col justify-between";
    card.onclick = () => {
      window.location.href = `/recipe?id=${recipe.RCP_SEQ}`;
    };

    const hasSub = activeSubs.length > 0;
    const badgeHtml = hasSub
      ? `<span class="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 px-sm py-1 rounded-full font-label-sm flex items-center gap-1">
          <span class="material-symbols-outlined text-[14px]">swap_calls</span>
          대체 조리 (${activeSubs.map(s => `${s.allergen}→${s.replacement}`).join(', ')})
         </span>`
      : `<span class="bg-primary-container/20 text-on-primary-container px-sm py-1 rounded-full font-label-sm flex items-center gap-1">
          <span class="material-symbols-outlined text-[14px]">check_circle</span>
          안전함
         </span>`;

    const imgUrl = recipe.ATT_FILE_NO_MAIN || recipe.ATT_FILE_NO_MK || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAhVDUQVmKFs4UmdLjdSMaJmClSwMHji-ebX7IvgpJpNMw6ey5emCNu0KYg4a6ZpaSm7-zsoHbmtW7TAlbPfslbZ9hZp0Iu-ltvgBmmIkBIOUB2tOANND3OyJ-zr2KGViMnL3A16bS2CfS3sMcqoguqHjI3p5_e-yAdehkQIzrsBhgIvjJpD8apILCUpv6rbvfSG3tEsfsum4gTyTbDVEKqEuBx3j6ofwIzR1L0IPApmwdpt5a13JMweH3qYca1mVtq51p__A-UjeA';
    const shortDesc = processedParts.length > 60 ? processedParts.substring(0, 60) + '...' : processedParts;

    card.innerHTML = `
      <div>
        <div class="h-48 overflow-hidden relative">
          <img loading="lazy" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" src="${imgUrl}" alt="${recipe.RCP_NM}"/>
        </div>
        <div class="p-md">
          <div class="flex justify-between items-start mb-xs gap-xs">
            <h3 class="font-headline-md text-[18px] text-on-surface truncate font-bold flex-1">${recipe.RCP_NM}</h3>
            <div class="shrink-0">${badgeHtml}</div>
          </div>
          <p class="font-body-sm text-on-surface-variant mb-md leading-relaxed">${shortDesc}</p>
        </div>
      </div>
      <div class="px-md pb-md flex gap-xs">
        <span class="bg-surface-container-high px-xs py-1 rounded text-label-sm text-outline">#${recipe.RCP_PAT2}</span>
        <span class="bg-surface-container-high px-xs py-1 rounded text-label-sm text-outline">#${recipe.RCP_WAY2}</span>
      </div>
    `;
    container.appendChild(card);
  });
}

async function initRecipePage(userAllergies = []) {
  const urlParams = new URLSearchParams(window.location.search);
  const recipeId = urlParams.get('id');

  if (!recipeId) {
    alert("레시피 ID가 유효하지 않습니다.");
    window.location.href = '/';
    return;
  }

  let recipe = null;
  const cached = sessionStorage.getItem('recipe_' + recipeId);
  if (cached) {
    try {
      recipe = JSON.parse(cached);
    } catch(e) {
      console.error(e);
    }
  }

  if (!recipe) {
    recipe = FALLBACK_RECIPES.find(x => x.RCP_SEQ === recipeId);
  }

  if (!recipe) {
    try {
      const apiKey = "a221b8145b894fa99895";
      const url = `https://openapi.foodsafetykorea.go.kr/api/${apiKey}/COOKRCP01/json/1/1/RCP_SEQ=${recipeId}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.COOKRCP01 && data.COOKRCP01.row && data.COOKRCP01.row.length > 0) {
          recipe = data.COOKRCP01.row[0];
        }
      }
    } catch (e) {
      console.error("Failed to fetch single recipe details:", e);
    }
  }

  if (!recipe) {
    alert("레시피 상세 정보를 불러올 수 없습니다.");
    window.location.href = '/';
    return;
  }

  const imgEl = document.getElementById('recipe-detail-img');
  if (imgEl) {
    imgEl.src = recipe.ATT_FILE_NO_MK || recipe.ATT_FILE_NO_MAIN || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAhVDUQVmKFs4UmdLjdSMaJmClSwMHji-ebX7IvgpJpNMw6ey5emCNu0KYg4a6ZpaSm7-zsoHbmtW7TAlbPfslbZ9hZp0Iu-ltvgBmmIkBIOUB2tOANND3OyJ-zr2KGViMnL3A16bS2CfS3sMcqoguqHjI3p5_e-yAdehkQIzrsBhgIvjJpD8apILCUpv6rbvfSG3tEsfsum4gTyTbDVEKqEuBx3j6ofwIzR1L0IPApmwdpt5a13JMweH3qYca1mVtq51p__A-UjeA';
  }

  const titleEl = document.getElementById('recipe-detail-title');
  if (titleEl) titleEl.textContent = recipe.RCP_NM;

  const categoryEl = document.getElementById('recipe-detail-category');
  if (categoryEl) categoryEl.textContent = recipe.RCP_PAT2;

  const wayEl = document.getElementById('recipe-detail-way');
  if (wayEl) wayEl.textContent = recipe.RCP_WAY2;

  const tipEl = document.getElementById('recipe-safety-tip');
  if (tipEl) tipEl.textContent = recipe.RCP_NA_TIP || '저감화 조리법 정보가 없습니다.';

  if (document.getElementById('nutrition-calories')) document.getElementById('nutrition-calories').textContent = recipe.INFO_ENG || '0';
  if (document.getElementById('nutrition-carbs')) document.getElementById('nutrition-carbs').textContent = recipe.INFO_CAR || '0';
  if (document.getElementById('nutrition-protein')) document.getElementById('nutrition-protein').textContent = recipe.INFO_PRO || '0';
  if (document.getElementById('nutrition-fat')) document.getElementById('nutrition-fat').textContent = recipe.INFO_FAT || '0';
  if (document.getElementById('nutrition-sodium')) document.getElementById('nutrition-sodium').textContent = recipe.INFO_NA || '0';

  const { processedParts, activeSubs } = processAllergySubstitution(recipe.RCP_PARTS_DTLS, userAllergies);

  const ingredientsContainer = document.getElementById('recipe-ingredients-container');
  if (ingredientsContainer) {
    ingredientsContainer.innerHTML = '';
    let htmlText = processedParts.replace(/\n/g, '<br/>');
    activeSubs.forEach(sub => {
      const regex = new RegExp(sub.replacement, 'g');
      htmlText = htmlText.replace(regex, `<span class="bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-bold px-1 rounded border border-amber-300">${sub.replacement}</span>`);
    });
    ingredientsContainer.innerHTML = htmlText;
  }

  const banner = document.getElementById('recipe-substitution-banner');
  const subList = document.getElementById('recipe-substitution-list');
  if (banner && subList) {
    if (activeSubs.length > 0) {
      banner.classList.remove('hidden');
      subList.innerHTML = '';
      activeSubs.forEach(sub => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${sub.allergen}</strong> 알레르기 유발 성분이 <strong>${sub.replacement}</strong>(으)로 대체되었습니다.`;
        subList.appendChild(li);
      });
    } else {
      banner.classList.add('hidden');
    }
  }

  const stepsContainer = document.getElementById('recipe-steps-container');
  if (stepsContainer) {
    stepsContainer.innerHTML = '';
    for (let i = 1; i <= 20; i++) {
      const stepKey = 'MANUAL' + String(i).padStart(2, '0');
      const imgKey = 'MANUAL_IMG' + String(i).padStart(2, '0');
      const rawStepText = recipe[stepKey];
      const imgUrl = recipe[imgKey];
      
      if (rawStepText && rawStepText.trim()) {
        let { processedParts: stepText } = processAllergySubstitution(rawStepText, userAllergies);
        activeSubs.forEach(sub => {
          const regex = new RegExp(sub.replacement, 'g');
          stepText = stepText.replace(regex, `<span class="bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-bold px-1 rounded border border-amber-300">${sub.replacement}</span>`);
        });

        const stepDiv = document.createElement('div');
        stepDiv.className = "flex flex-col md:flex-row gap-md items-start border-b border-outline-variant/30 pb-md last:border-b-0";
        stepDiv.innerHTML = `
          ${imgUrl ? `<img loading="lazy" class="w-full md:w-48 aspect-video md:aspect-square object-cover rounded-lg bg-surface-container-high" src="${imgUrl}" alt="Step ${i}"/>` : ''}
          <div class="space-y-xs flex-1">
            <span class="text-label-md font-bold text-primary">단계 ${i}</span>
            <p class="text-body-md text-on-surface leading-relaxed">${stepText}</p>
          </div>
        `;
        stepsContainer.appendChild(stepDiv);
      }
    }
  }
}

