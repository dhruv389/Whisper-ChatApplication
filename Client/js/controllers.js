// client/js/controllers.js
angular.module('chatApp')

  // Home Controller
 

    

  // Chat App Controller (Navbar, FAQ, Animations, etc.)
  .controller('ChatAppController', ['$scope', '$timeout', function($scope, $timeout) {
    // Mobile menu toggle
    console.log("heiiedebknk-")
    $scope.mobileMenuOpen = false;
    $scope.toggleMobileMenu = function() {
      $scope.mobileMenuOpen = !$scope.mobileMenuOpen;
    };

    // FAQ Items
    $scope.faqItems = [
      {
        question: 'Is WhisperChat really private?',
        answer: 'Yes! WhisperChat uses end-to-end encryption...',
        isOpen: false
      },
      {
        question: 'How many people can join a room?',
        answer: 'Each room can support up to 100 participants...',
        isOpen: false
      },
      {
        question: 'Can I use WhisperChat on multiple devices?',
        answer: 'Absolutely! WhisperChat syncs across all your devices...',
        isOpen: false
      },
      {
        question: 'Is WhisperChat free to use?',
        answer: 'WhisperChat offers a free tier with all core features...',
        isOpen: false
      },
      {
        question: 'What happens if I lose my room key?',
        answer: 'Room creators can reset access keys from their account settings...',
        isOpen: false
      }
    ];

    $scope.toggleFaq = function(index) {
      $scope.faqItems[index].isOpen = !$scope.faqItems[index].isOpen;
    };

    // Scroll animation init
    initScrollAnimations();

    function initScrollAnimations() {
      const animateElements = function() {
        const sections = ['#features', '#how-it-works', '#faq'];

        sections.forEach(section => {
          const element = document.querySelector(section);
          if (element && isElementInViewport(element)) {
            const headings = element.querySelectorAll('h2, .slide-up');
            headings.forEach(heading => {
              heading.classList.add('active');
            });
          }
        });
      };

      function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
          rect.top <= window.innerHeight * 0.75 &&
          rect.left >= 0 &&
          rect.bottom >= 0 &&
          rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
      }

      $timeout(animateElements, 100);
      window.addEventListener('scroll', animateElements);
    }
  }])






  //---------------------------------------------------------------------------------------

// Profile Controller
.controller('ProfileController', function($scope, $http,authService) {
  $scope.user = {};
  $scope.success = '';
  $scope.error = '';

 

  const firebaseUser = authService.getUser();

  // Fetch user data by email
  $scope.fetchUser = function() {
    if (!$scope.user.email) {
      $scope.error = 'Please enter an email';
      return;
    }

    $http.get('http://localhost:5000/api/user/' + $scope.user.email)
      .then(function(response) {
        $scope.user = response.data.user;
        $scope.success = 'User fetched successfully';
        $scope.error = '';
      })
      .catch(function(err) {
        console.error(err);
        $scope.error = err.data.message || 'User not found';
        $scope.success = '';
      });
  };

  // Create or update user
  $scope.saveUser = function() {
    if (!$scope.user.email) {
      $scope.error = 'Email is required';
      return;
    }

    $http.post('http://localhost:5000/api/create-user', $scope.user)
      .then(function(res) {
        $scope.success = 'User created successfully';
        $scope.error = '';
      })
      .catch(function(err) {
        if (err.status === 400 && err.data.message === 'User already exists') {
          // Try to update instead
          $http.put('/api/update-user/' + $scope.user.email, $scope.user)
            .then(function(res) {
              $scope.success = 'User updated successfully';
              $scope.error = '';
            })
            .catch(function(err) {
              $scope.error = err.data.error || 'Error updating user';
              $scope.success = '';
            });
        } else {
          $scope.error = err.data.error || 'Error creating user';
          $scope.success = '';
        }
      });
  };
})


.controller("ProfileController", function($scope, $rootScope) {
  $scope.user = $rootScope.user;
})
.controller("RoomMainController", function($scope, $rootScope) {
  $scope.user = $rootScope.user;
})
.controller("ChatAppController", function($scope, $rootScope) {
  $scope.user = $rootScope.user;
})





.controller("RoomMainController", function($scope, $http, $location, $timeout) {
  // Initial state setup
  $scope.tabActive = 'create'; // Default active tab (replaces showCreate/showJoin modals)
  $scope.useAiImage = false;
  $scope.useAiProfileImage = false;
  $scope.room = {};
  $scope.joinData = {};
  $scope.error = "";
  
  // Get user from localStorage (kept from your original controller)
  const user2 = JSON.parse(localStorage.getItem("firebaseUser"));
  $scope.user = {
    email: user2 ? user2.email : ''
  };
  
  // Tab switching function (replaces openModal)
  $scope.setTab = function(tab) {
    $scope.tabActive = tab;
    $scope.error = '';
    
    // Animate tab change
    anime({
      targets: '.form-transition',
      opacity: [0.8, 1],
      translateY: ['-10px', '0px'],
      easing: 'easeOutExpo',
      duration: 400
    });
  };
  
  // Generate AI image from prompt
  $scope.generateImage = function(formType) {
    if (formType === 'create' && $scope.room.imagePrompt) {
      const encodedPrompt = encodeURIComponent($scope.room.imagePrompt);
      $scope.room.imageLink = `https://image.pollinations.ai/prompt/${encodedPrompt}`;
      
      // Animation feedback
      anime({
        targets: '.preview-image',
        scale: [0.9, 1],
        opacity: [0, 1],
        easing: 'easeOutExpo',
        duration: 600
      });
    } 
    else if (formType === 'join' && $scope.joinData.imagePrompt) {
      const encodedPrompt = encodeURIComponent($scope.joinData.imagePrompt);
      $scope.joinData.imageLink = `https://image.pollinations.ai/prompt/${encodedPrompt}`;
      
      // Animation feedback
      anime({
        targets: '.preview-image',
        scale: [0.9, 1],
        opacity: [0, 1],
        easing: 'easeOutExpo',
        duration: 600
      });
    }
  };
  
  // Create room function - KEEPING ORIGINAL LOGIC
  $scope.createRoom = function() {
    $http.post("http://localhost:5000/api/create-room", $scope.room)
      .then(function(res) {
        $scope.room.secretKey = res.data.secretKey;
        
        // Animation feedback for success message
        $timeout(function() {
          anime({
            targets: '.glass-light',
            translateY: [20, 0],
            opacity: [0, 1],
            easing: 'easeOutExpo',
            duration: 800
          });
        }, 200);
      })
      .catch(function(err) {
        console.error("Error creating room", err);
        $scope.error = "Error creating room. Please try again.";
      });
  };
  
  // Join room function - KEEPING ORIGINAL LOGIC
  $scope.joinRoom = function() {
    console.log(user2);
    $scope.joinData.email = user2.email;
    
    console.log("Secret Key:", $scope.joinData.secretKey); // Debug
    if (!$scope.joinData.secretKey) {
      window.alert("Please enter a secret key");
      $scope.error = "Secret key is required!";
      return;
    }
    
    $http.post(`http://localhost:5000/api/create-user`, $scope.joinData)
      .then(function(res) {
        $location.path("/room/" + $scope.joinData.secretKey);
      })
      .catch(function(err) {
        $scope.error = "Invalid secret key!";
        console.error("Join error:", err);
      });
  };
  
  // Copy to clipboard function (new utility)
  $scope.copyToClipboard = function(text) {
    navigator.clipboard.writeText(text).then(function() {
      console.log('Copied to clipboard!');
    });
  };
  
  // Initialize some animations
  $timeout(function() {
    anime({
      targets: '.gradient-text',
      opacity: [0, 1],
      translateY: [20, 0],
      easing: 'easeOutExpo',
      duration: 1200
    });
  }, 300);
})




.controller('ChatRoomController', function (
  $scope, $http, $routeParams, $timeout
) {
  const socket = io(); // Loaded from public/index.html
  const secretKey = $routeParams.roomId;

  $scope.user = JSON.parse(localStorage.getItem("firebaseUser"));
  $scope.users = [];
  $scope.messages = [];
  $scope.newMessage = "";
  $scope.owner = null;

  // Helper: scroll to bottom
  function scrollToBottom() {
    $timeout(() => {
      const chatBox = document.getElementById('chat-box');
      if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
    }, 100);
  }

  // Fetch initial data
  function loadChatData() {
    $http.get(`http://localhost:5000/api/users/${secretKey}`).then(res => {
      $scope.users = res.data.Users || [];
    }).catch(err => console.error("❌ Users fetch error", err));

    $http.get(`http://localhost:5000/api/owner/${secretKey}`).then(res => {
      $scope.owner = res.data.user || null;
    }).catch(err => console.error("❌ Owner fetch error", err));

    $http.get(`http://localhost:5000/api/roommessage/${secretKey}`).then(res => {
      $scope.messages = res.data || [];
      scrollToBottom();
    }).catch(err => console.error("❌ Messages fetch error", err));
  }

  // Send message
  $scope.sendMessage = function () {
    const msgText = $scope.newMessage.trim();
    if (!msgText) return;

    const messageObj = {
      secretKey,
      message: msgText,
      email: $scope.user.email,
      name: $scope.user.name,
      imageLink: $scope.user.imageLink
    };

    socket.emit('send-message', { secretKey, message: messageObj });

    $http.post(`http://localhost:5000/api/room/message`, messageObj).then(() => {
      $scope.newMessage = "";
    }).catch(err => console.error("❌ Message save failed", err));
  };

  // Socket listeners
  socket.on('receive-message', (message) => {
    $scope.$apply(() => {
      $scope.messages.push(message);
      scrollToBottom();
    });
  });

  socket.on('user-list', (users) => {
    $scope.$apply(() => {
      $scope.users = users;
    });
  });

  socket.on('room-closed', () => {
    alert("Room was closed by the owner.");
    window.location.href = "/";
  });

  // On load
  loadChatData();
  socket.emit('join-room', { secretKey, user: $scope.user });
});