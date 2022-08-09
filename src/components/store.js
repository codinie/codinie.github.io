import create from 'zustand';
import {devtools} from 'zustand/middleware';

const loginStore = (set) => ({
    loginstate : false , 
    setLoginState(){
        set((state)=> ({loginstate: true}))
    },
    setLogoutState(){
        set((state)=> ({loginstate: false}))
    }
})

export let useLoginStore = create(devtools(loginStore));


const marketStore = (set) => ({
    marketInfo: {},
    setMarketInfo(res){
        set(()=> ({ marketInfo : res}))
    } 
})

export let useMarketStore = create(devtools(marketStore));

