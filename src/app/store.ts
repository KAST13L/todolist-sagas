import {tasksReducer, tasksWatcher} from '../features/TodolistsList/tasks-reducer';
import {todolistsReducer, todolistsWatcher} from '../features/TodolistsList/todolists-reducer';
import {applyMiddleware, combineReducers, createStore} from 'redux'
import thunkMiddleware from 'redux-thunk'
import {authReducer, authWatcher} from "../features/TodolistsList/Login/auth-reducer";
import createSagaMiddleware from 'redux-saga';
import {all} from 'redux-saga/effects';
import {appReducer, appWatcher} from './app-reducer'

const sagaMiddleware = createSagaMiddleware()

const rootReducer = combineReducers({
    app: appReducer,
    auth: authReducer,
    tasks: tasksReducer,
    todolists: todolistsReducer
})

export const store = createStore(rootReducer, applyMiddleware(thunkMiddleware, sagaMiddleware));
export type AppRootStateType = ReturnType<typeof rootReducer>

sagaMiddleware.run(rootWatcher)

function* rootWatcher() {
    yield all([
        appWatcher(),
        tasksWatcher(),
        authWatcher(),
        todolistsWatcher()
    ])
  }

// @ts-ignore
window.store = store;