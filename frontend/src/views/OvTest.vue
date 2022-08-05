<template class="">
  <div class="w3-black wait-background" style="height: 1000px;">
    <div class="w3-main mx-5">

      <!-- Header -->
      <header id="portfolio">
        <div class="w3-container">
        <h1><b>{{ roomTitle }}</b></h1>
        <div class="w3-section w3-bottombar w3-padding-16">
          <a href="/lobby">
          <!-- <router-link :to="{ name: 'lobby' }" > -->
          <!-- 방나가기 /room/roomNum -->
          <!-- method: PUT -->
          <!-- 방 삭제 /room/roomNum -->
          <!-- method: DELETE -->
          
            <button v-if="isCaptain" 
            class="w3-button w3-white w3-hide-small" @click="sendBreak">
            <i class='fa fa-close'></i>방삭제</button>
            <button v-if="!isCaptain"
            class="w3-button w3-white w3-hide-small" @click="sendOut">
            <i class='fa fa-close'></i>방나가기</button>

          <!-- </router-link> -->
          </a>
        </div>
        </div>
      </header>
  
  <!-- First Photo Grid-->
  <div class="w3-row">
    <div 
    class="w3-col m4 mx-5 my-5 w3-container w3-margin-bottom border border-secondary w3-white"
    v-for="(item, idx) in usersList"
    :key="idx"
    >
      <p>{{ item.nickName }}</p>
      <p>{{ item.winRate }}</p>
      <button id="readyButton" @click="isReady" v-if="!isCaptain">준비</button>
    </div>
  </div>

  <div>
    <div class="chatList">
      <div
        v-for="(item, idx) in recvList"
        :key="idx"
      >
        <h3>{{ item.nickName }} : {{ item.content }}</h3>
      </div>
    </div>
    <div class="chatItem">
      <input
      v-model="message"
      type="text"
      @keyup="sendMessage"
      class="chatInput"
      >
      <button @click="sendMessage" id="chatButton">보내기</button>
    </div>
  </div>
  
  
  </div>
    <h1>대기방임</h1>
    <hr>
    <div v-if="isCaptain">
      <button v-if="ifStart" @click="startSignal">게임시작</button>
      <button v-else disabled>게임시작</button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex'
const roomdataStore = "roomdataStore"
const memberStore = "memberStore"

import Stomp from 'webstomp-client'
import SockJS from 'sockjs-client'

export default {

  components: {
  },
  data() {
    return {
      num : 1,
      usersInfo: [],
      nickName: 'a',
      message: '',
      recvList: [],
      startGame: false,
      ifStart: false,
      ifReady: false
    }
  },
  
  computed: {
    ...mapState(memberStore, ["userInfo"]),
    ...mapGetters(roomdataStore, [
      'roomNo',
      'roomTitle',
      'isCaptain'
    ]),
    ...mapGetters(memberStore, [
      'isLogin',
    ]),
    ...mapActions(roomdataStore, [
      'deleteRoom',
      'enterRoom',
      'saveRoomTitle',
      'saveIsCaptain',
    ])
  },

  created() {
    // App.vue가 생성되면 소켓 연결을 시도합니다.
    this.connect()
    console.log(this.isCaptain)
    console.log(this.roomNo)
    this.sendProfile()
  },

  methods: {
    // 소켓 연결
    connect() {
      const serverURL = "https://i7e107.p.ssafy.io/roomSocket"
      let socket = new SockJS(serverURL);
      this.stompClient = Stomp.over(socket);
      console.log(`소켓 연결을 시도합니다. 서버 주소: ${serverURL}`)
      this.stompClient.connect(
        {},
        frame => {
          // 소켓 연결 성공
          this.connected = true;
          console.log('소켓 연결 성공', frame);

          // 채팅
          this.stompClient.subscribe(`topic/sendChat/${this.roomNo}`, res => {
            console.log('구독으로 받은 채팅입니다.', res.body);
            this.recvList.push(JSON.parse(res.body))
          });

          // 프로필
          this.stompClient.subscribe(`topic/sendProfile/${this.roomNo}`, res => {
            console.log('구독으로 받은 프로필입니다.', res.body);
            this.usersInfo.push(JSON.parse(res.body))

            // 방 나가기
            if (res.body.progress === 'out') {
              this.$route.push('lobby');
            }
          });

          // 레디
          this.stompClient.subscribe(`topic/sendReady/${this.roomNo}`, res => {
            console.log('구독으로 받은 레디입니다.', res.body);
            const readyData = JSON.parse(res.body)
            this.ifStart = readyData.ifStart;

            if (readyData.startGame === true) {
              this.$route.push({ name: 'ingame', params: { id_pk: this.roomNo } });
            }
          });

          // 방 폭파
          this.stompClient.subscribe(`topic/sendBreak/${this.roomNo}`, res => {
            console.log('방 폭파.', res.body);
            this.$route.push('lobby');
          });
        },

        error => {
          // 소켓 연결 실패
          console.log('소켓 연결 실패', error);
          this.connected = false;
        }
      );        
    },

    // 채팅
    sendChat() {
      console.log("Send message:" + this.message);
      if (this.stompClient && this.stompClient.connected) {
        const msg = { 
          roomNo: this.roomNo,
          nickName: this.nickName,
          content: this.message 
        };
        console.log(msg);
        this.stompClient.send('/receiveChat', JSON.stringify(msg), {});
      }
    },

    // 프로필
    sendProfile() {
      if (this.stompClient && this.stompClient.connected) {
        const msg = { 
          progress: 'in',
          roomNo: this.roomNo,
          id: this.userInfo.id
        };
        console.log(msg);
        this.stompClient.send('/receiveProfile', JSON.stringify(msg), {});
      }
    },

    // 레디
    sendReady() {
        if (this.stompClient && this.stompClient.connected) {
        const msg = { 
          roomNo: this.roomNo,
          startGame: this.startGame,
          ifReady: this.ifReady,
          id: this.userInfo.id
        };
        console.log(msg);
        this.stompClient.send('/receiveReady', JSON.stringify(msg), {});
      }
    },

    // 방 나가기
    sendOut() {
      if (this.stompClient && this.stompClient.connected) {
        const msg = { 
          progress: 'out',
          roomNo: this.roomNo,
          id: this.userInfo.id
        };
        console.log(msg);
        this.stompClient.send('/receiveProfile', JSON.stringify(msg), {});
      }
    },

    // 방 폭파
    sendBreak() {
        if (this.stompClient && this.stompClient.connected) {
        const msg = { 
          roomNo: this.roomNo,
        };
        console.log(msg);
        this.stompClient.send('/receiveBreak', JSON.stringify(msg), {});
      }
    },

    sendMessage (e) {
      if(e.keyCode === 13 && this.nickName !== '' && this.message !== ''){
        this.send()
        this.message = ''
      }
    },

    // 레디
    isReady() {
      const readyButton = document.getElementById("readyButton")
      if (this.ifReady) {
        readyButton.innerText = "준비완료"
      } else {
        readyButton.innerText = "준비"
      }
      this.ifReady = !this.ifReady
      this.sendReady()
    },

    // 게임시작
    startSignal() {
      this.startGame = true
      this.sendReady()
    }
  },
  mounted() {
  }
}
</script>

<style>
.w3-bar.w3-black.w3-hide-small .w3-bar-item.w3-button {
  display: inline-block;
  height: 40px;
} 
.w3-bar.w3-black.w3-hide-small .w3-bar-item.w3-right {
  height: 40px;
  padding-top: 6px;
  padding-right: 5px;
  margin: 0 0;
}
.w3-bar.w3-black.w3-hide-small .w3-bar-item.w3-right > i {
  position: relative;
  top: -2px;
}
.w3-bar.w3-black.w3-hide-small .fa {
  /* height: 30px; */
  margin: 0;
  /* padding-top: 6px; 
  margin: 0 0; */
}
.wait-background {
  background-image: url(../../public/homedesign/images/wait_mafia.gif);
  background-repeat: no-repeat;
  background-size: cover;
}

.chatList {
  height: 300px;
  width: 80%;
  background-color: whitesmoke;
  margin: auto;
}
.chatList::-webkit-scrollbar {
  width: 2px;
}

.chatItem {
  width: 80%;
  display: flex;
  margin: auto;
}

.chatInput {
  width: 955px;
}

</style>