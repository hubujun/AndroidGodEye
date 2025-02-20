package cn.hikyson.godeye.core.utils;

import android.os.Handler;
import android.os.Looper;

import java.util.concurrent.Executor;
import java.util.concurrent.ThreadFactory;
import java.util.concurrent.atomic.AtomicInteger;

import io.reactivex.Scheduler;
import io.reactivex.android.schedulers.AndroidSchedulers;
import io.reactivex.annotations.SchedulerSupport;
import io.reactivex.schedulers.Schedulers;

/**
 * Created by kysonchao on 2018/1/19.
 */
public class ThreadUtil {
    public static Scheduler sMainScheduler = AndroidSchedulers.mainThread();
    public static Scheduler sComputationScheduler = Schedulers.computation();

    public static boolean isMainThread() {
        return Looper.myLooper() == Looper.getMainLooper();
    }

    public static void ensureMainThread(String tag) {
        if (!isMainThread()) {
            throw new IllegalStateException(tag + " operation must execute on main thread!");
        }
    }

    public static void ensureMainThread() {
        ensureMainThread("this");
    }

    public static void ensureWorkThread(String tag) {
        if (isMainThread()) {
            throw new IllegalStateException(tag + " operation must execute on work thread!");
        }
    }

    public static void ensureWorkThread() {
        ensureWorkThread("this");
    }

    private static Handler sHandler = new Handler(Looper.getMainLooper());

    public static Executor sMain = new Executor() {
        @Override
        public void execute(Runnable command) {
            sHandler.post(command);
        }
    };

    public static class NamedThreadFactory implements ThreadFactory {
        private final ThreadGroup group;
        private final AtomicInteger threadNumber = new AtomicInteger(1);
        private final String namePrefix;

        public NamedThreadFactory(String namePrefix) {
            SecurityManager s = System.getSecurityManager();
            group = (s != null) ? s.getThreadGroup() :
                    Thread.currentThread().getThreadGroup();
            this.namePrefix = namePrefix;
        }

        public Thread newThread(Runnable r) {
            Thread t = new Thread(group, r,
                    namePrefix + threadNumber.getAndIncrement(), 0);
            if (t.isDaemon()) t.setDaemon(false);
            if (t.getPriority() != Thread.NORM_PRIORITY) {
                t.setPriority(Thread.NORM_PRIORITY);
            }
            return t;
        }

    }

}
