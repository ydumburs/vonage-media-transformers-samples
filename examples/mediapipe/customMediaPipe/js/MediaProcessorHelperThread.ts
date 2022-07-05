import {MediaProcessor, setVonageMetadata} from '@vonage/media-processor'
import { MediaPipeModelType } from '@vonage/ml-transformers'
import { MediapipePorcessInterface } from './MediapipeInterfaces'
import MediapipeTransformer from './mediapipeTransformer'


if( 'function' === typeof importScripts) {
    class MediapipePorcess implements MediapipePorcessInterface {
        constructor() {
            console.log('MediapipePorcess')
        }
        
        onSend(data: ImageBitmap): Promise<void> {
            return new Promise<void>((resolve) => {
                postMessage({
                    operation: 'send',
                    info: data
                }, [data])
                resolve()
            })
        }
    }
    let mediaProcessor_: MediaProcessor
    let mediaipeTransformer_: MediapipeTransformer
    let mediapipePorcess_: MediapipePorcess
    let modelType_: MediaPipeModelType

    onmessage = async (event) => {
        const {operation} = event.data

        if(operation === 'init'){
            const {metaData, modelType, mediapipeConsts} = event.data
            if(metaData){
                setVonageMetadata(JSON.parse(metaData))
            }
            modelType_ = modelType
            mediaipeTransformer_ = new MediapipeTransformer()
            mediapipePorcess_ = new MediapipePorcess()
            mediaipeTransformer_.setMediapipeConsts(JSON.parse(mediapipeConsts))
            mediaipeTransformer_.init(modelType, mediapipePorcess_).then( () => {
                mediaProcessor_ = new MediaProcessor()
                mediaProcessor_.on('error', e => {
                    postMessage({
                        operation: 'mediaProcessor',
                        type: 'error',
                        info: e
                    })
                })

                mediaProcessor_.on('pipelineInfo', i => {
                    postMessage({
                        operation: 'mediaProcessor',
                        type: 'pipelineInfo',
                        info: i
                    })
                })

                mediaProcessor_.on('warn', w => {
                    postMessage({
                        operation: 'mediaProcessor',
                        type: 'warn',
                        info: w
                    })
                })

                mediaProcessor_.setTransformers([mediaipeTransformer_]).then( () => {
                    postMessage({
                        operation: 'init',
                        info: 'success'
                    })
                }).catch(e => {
                    postMessage({
                        operation: 'init',
                        error: 'init error' + e
                    })
                })
            })
        } else if(operation === 'transform'){
            const {readable, writable} = event.data
            mediaProcessor_.transform(readable, writable).then(() => {
                postMessage({
                    operation: 'transform',
                    info: 'success'
                })
            }).catch(e => {
                postMessage({
                    operation: 'transform',
                    error: 'transform error' + e
                })
            })

        } else if(operation === 'destroy'){
            mediaProcessor_.destroy().then( () => {
                postMessage({
                    operation: 'destroy',
                    info: 'success'
                })
            }).catch(e => {
                postMessage({
                    operation: 'destroy',
                    error: 'destroy error' + e
                })
            })

        } else if(operation === 'onResults'){
            const {info} = event.data
            if(info){
                if(modelType_ === 'selfie_segmentation'){
                    mediaipeTransformer_.onResult(info)
                }else{
                    mediaipeTransformer_.onResult(JSON.parse(info))
                }
            }
        }
    }
}