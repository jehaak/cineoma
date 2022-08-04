// 들어올 데이터:
// 활성화 된 방 정보(정렬기능 넣을거라서 정렬기준 저장 필요)
// 친구목록 데이터
// 이 파일 필요없어서 지울수도 있슴

import {
  roomList,
} from "@/api/lobby.js";


const lobbyStore = {
  namespaced: true,
  state: {
    friendList: 'a',
    roomList: [
      {
      roomTitle: '방제1',
      roomNo: 11,
      memberCnt: 2,
      isPassword: 0,
      memberList: [
          {
            nickname: 'nickname1',
            imagePath: 'imagePath1',
          },
          {
            nickname: 'nickname2',
            imagePath: 'imagePath2',
          },
          {
            nickname: 'nickname3',
            imagePath: 'imagePath3',
          },  
          ]
      },
      {
        roomTitle: '방제2',
        roomNo: 12,
        memberCnt: 3,
        isPassword: 1,
        memberList: [
            {
              nickname: 'nickname1',
              imagePath: 'imagePath1',
            },
            {
              nickname: 'nickname2',
              imagePath: 'imagePath2',
            },
            {
              nickname: 'nickname3',
              imagePath: 'imagePath3',
            },  
            ]
      },
      {
        roomTitle: '방제3',
        roomNo: 13,
        memberCnt: 4,
        isPassword: 1,
        memberList: [
            {
              nickname: 'nickname1',
              imagePath: 'imagePath1',
            },
            {
              nickname: 'nickname2',
              imagePath: 'imagePath2',
            },
            {
              nickname: 'nickname3',
              imagePath: 'imagePath3',
            },  
            ]
      }
    ]
  },
  getters: {
    friendList(state) {
      return state.friendList;
    },
    roomList(state) {
      return state.roomList;
    },
  },
  mutations: {
    SET_FRIENDLIST: (state, friendList) => state.friendList = friendList,
    SET_ROOMLIST: (state, roomList) => state.roomList = roomList,
  },
  actions: {
    async getRoomList({ commit }) {
      await roomList(
        (response) => {
          commit('SET_ROOMLIST', response.data.roomList)
        },
        () => {},
      );
    },
  },
};

export default lobbyStore;


// export default createStore({
//   state: {
//     friendList: {},
//     roomList: {},
//   },
  
//   getters: {
//     // friendList: state => state.friendList,
//     // roomList: state => state.roomList,
//   },

//   mutations: {
//     SET_FRIENDLIST: (state, friendList) => state.friendList = friendList,
//     SET_ROOMLIST: (state, roomList) => state.roomList = roomList,
//   },

//   actions: {
//   },

//   modules: {
//   },
// })
