<template>
  <div>
    <button type="button" class="w3-button w3-theme mx-3" data-bs-toggle="modal" data-bs-target="#makeRoomModal" style="font-family: 'NeoDunggeunmo Code'; font-size: 20px;">
      <i class="fa fa-pencil"></i>방만들기
    </button>

    <!-- Modal -->
    <div class="modal" style="margin-top: 200px;" id="makeRoomModal" data-bs-backdrop="static" data-bs-keyboard="false" aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <div class="modal-dialog" style="z-index: 10000000;">
        <div class="modal-content lobbyModal" style="z-index: 1100;">
          <div class="modal-header">
            <h3
              class="modal-title"
              style="color: white; margin-left: 50px"
            >
            방만들기
            </h3>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body" style="color: white; margin-left: 50px">
            <p>방 제목과 비밀번호를 설정해주세요</p>
            <input contenteditable="true" type="text" class="w3-border w3-padding" style="color: gray; font-family: 'NeoDunggeunmo Code';" placeholder="방 제목:" v-model="subject">
            <br>
            <input contenteditable="true" type="text" class="w3-border w3-padding" style="color: gray; font-family: 'NeoDunggeunmo Code';" placeholder="비밀번호(선택):" v-model="password">
          </div>
          <div class="modal-footer">
            <button                       
              class="w3-button w3-theme w3-white"
              style="
                font-family: 'NeoDunggeunmo Code';
                font-size: 20px;
                border-radius: 4px;" 
              data-bs-dismiss="modal"><i class="fa fa-close"></i>나가기</button>
            <!-- <router-link :to="{ name: 'wait', params: { roomnumber: num } }" class="w3-bar-item w3-button"> -->
            <button v-on:click="createRoom" 
              class="w3-button w3-theme w3-white"
              style="
                font-family: 'NeoDunggeunmo Code';
                font-size: 20px;
                border-radius: 4px;
              "
              data-bs-dismiss="modal"
                    ><i class="fa fa-arrow-right"></i>방만들기</button>
            <!-- </router-link> -->
          </div>
        </div>
      </div>
    </div>

  </div>
</template>


<script>
  // import axios from 'axios'
  // import drf from '@/api/drf'
  // import router from '@/router'
  import { mapActions, mapGetters, } from 'vuex'
  const roomdataStore = "roomdataStore"
  const memberStore = "memberStore"

  export default {
    name: 'MakeRoom',
    components: {
    },
    data() {
      return {
        num : 1,
        hostId: "",
        subject: "",
        password: "",

      }
    },

    computed: {
      ...mapGetters(memberStore, [
        'isLogin',
        'checkUserInfo',
      ]),
    },

    methods: {
      ...mapActions(roomdataStore, [
        'saveRoomTitle',
        'saveIsCaptain',
        'makeRoom',
    ]),

      createRoom() {
        const roomInfo = {
          hostId: this.checkUserInfo.id,
          roomTitle: this.subject,
          password: this.password,
          size: 5
        }
        this.saveIsCaptain(true)
        this.saveRoomTitle(this.subject)
        this.makeRoom(roomInfo)
      }
    },
    created() {
      }
    }

</script>

<style>
</style>