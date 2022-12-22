import {SetAppErrorACType, setAppStatusAC, SetAppStatusACType} from "../../app/app-reducer";
import {authAPI, LoginParamsType} from "../../api/auth-api";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import axios from "axios";
import {call, put, takeEvery} from 'redux-saga/effects';

const initialState = {
    isLoggedIn: false
}
type InitialStateType = typeof initialState

export const authReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'login/SET-IS-LOGGED-IN':
            return {...state, isLoggedIn: action.value}
        default:
            return state
    }
}
// actions
export const setIsLoggedInAC = (value: boolean) =>
    ({type: 'login/SET-IS-LOGGED-IN', value} as const)

// sagas
export function* loginWorkerSaga(action: ReturnType<typeof loginWorkerSagaAC>){
    // @ts-ignore
    const res = yield call(authAPI.login, action.data)
    try {
        yield put(setAppStatusAC('loading'))
        if (res.data.resultCode === 0){
            yield put(setIsLoggedInAC(true))
            yield put(setAppStatusAC('succeeded'))

        } else {
            handleServerAppError(res.data, put)
        }
    } catch (e) {
        if(axios.isAxiosError(e)){
            handleServerNetworkError(e, put)
        }
    } finally {
        yield put(setAppStatusAC("idle"))
    }
}
export function* logoutWorkerSaga(){
    yield put(setAppStatusAC('loading'))
    // @ts-ignore
    const res = yield call(authAPI.logout)
    try {
        if (res.data.resultCode === 0) {
            yield put(setIsLoggedInAC(false))
            yield put(setAppStatusAC('succeeded'))
        } else {
            handleServerAppError(res.data, put)
        }
    } catch (e: any){
        handleServerNetworkError(e, put)
    }
}

// saga ACs
export const loginWorkerSagaAC = (data: LoginParamsType) => ({type:'AUTH/LOGIN', data})
export const logoutWorkerSagaAC = () => ({type:'AUTH/LOGOUT'})

// types
type ActionsType = ReturnType<typeof setIsLoggedInAC> | SetAppStatusACType | SetAppErrorACType

// authWatcher
export function* authWatcher(){
    yield takeEvery('AUTH/LOGIN', loginWorkerSaga)
    yield takeEvery('AUTH/LOGOUT', logoutWorkerSaga)
}