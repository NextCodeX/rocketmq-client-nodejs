#ifndef __ROCKETMQ_PRODUCER_START_OR_SHUTDOWN_H__
#define __ROCKETMQ_PRODUCER_START_OR_SHUTDOWN_H__

#include <nan.h>
#include <CProducer.h>
#include <MQClientException.h>

namespace __node_rocketmq__ {

using namespace std;

enum ProducerWorkerType {
    START_PRODUCER = 0,
    SHUTDOWN_PRODUCER
};

class ProducerStartOrShutdownWorker : public Nan::AsyncWorker {
public:
    ProducerStartOrShutdownWorker(Nan::Callback* callback, CProducer* producer_ptr, ProducerWorkerType type) :
        AsyncWorker(callback),
        producer_ptr(producer_ptr),
        ret(0),
        type(type)
    {
    }

    ~ProducerStartOrShutdownWorker()
    {
    }

    void Execute()
    {
        try
        {
            switch(type) {
            case START_PRODUCER:
                ret = StartProducer(producer_ptr); break;
            case SHUTDOWN_PRODUCER:
                ret = ShutdownProducer(producer_ptr); break;
            default: break;
            }
        }
        catch(const runtime_error e)
        {
            SetErrorMessage(e.what());
        }
        catch(const exception& e)
        {
            SetErrorMessage(e.what());
        }
    }

    void HandleOKCallback()
    {
        Nan::HandleScope scope;

        Local<Value> argv[] = {
            Nan::Undefined(),
            Nan::New<v8::Number>((int)ret),
        };
        callback->Call(2, argv);
    }

private:
    CProducer* producer_ptr;
    int ret;
    ProducerWorkerType type;
};

}

#endif
