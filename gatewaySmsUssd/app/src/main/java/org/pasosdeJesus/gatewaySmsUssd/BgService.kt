package org.pasosdeJesus.gatewaySmsUssd

import android.app.ForegroundServiceStartNotAllowedException
import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Intent
import android.content.pm.ServiceInfo.FOREGROUND_SERVICE_TYPE_DATA_SYNC
import android.os.Build
import android.os.IBinder
import android.widget.Toast
import androidx.core.app.NotificationCompat
import androidx.core.app.ServiceCompat

//import androidx.privacysandbox.tools.core.generator.build

class BgService : Service() {

    private val CHANNEL_ID = "ForegroundServiceChannel"

    override fun onStartCommand(intent: Intent, flags: Int, startId: Int): Int {

        //startForeground()
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            // Create the NotificationChannel.
            val name = getString(R.string.channel_name)
            val descriptionText = getString(R.string.channel_description)
            val importance = NotificationManager.IMPORTANCE_DEFAULT
            val mChannel = NotificationChannel(CHANNEL_ID, name, importance)
            mChannel.description = descriptionText
            // Register the channel with the system. You can't change the importance
            // or other notification behaviors after this.
            val notificationManager = getSystemService(NOTIFICATION_SERVICE) as NotificationManager
            notificationManager.createNotificationChannel(mChannel)
        }

        val notificationIntent = Intent(this, MainActivity::class.java) // Replace MainActivity with your app's main activity
        val pendingIntent = PendingIntent.getActivity(
            this,
            0, notificationIntent, PendingIntent.FLAG_IMMUTABLE
        )

        val notification: Notification = NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("Foreground Service")
            .setContentText("Your app is running in the foreground.")
            .setSmallIcon(R.drawable.ic_notification) // Replace with your notification icon
            .setContentIntent(pendingIntent)
            .build()

        ServiceCompat.startForeground(this, 100, notification, FOREGROUND_SERVICE_TYPE_DATA_SYNC)

        onTaskRemoved(intent)
        Toast.makeText(
            applicationContext, "This is a Service running in Foreround",
            Toast.LENGTH_SHORT
        ).show()
        return START_STICKY
    }
    override fun onBind(intent: Intent): IBinder? {
        // TODO: Return the communication channel to the service.
        throw UnsupportedOperationException("Not yet implemented")
    }
    override fun onTaskRemoved(rootIntent: Intent) {
        val restartServiceIntent = Intent(applicationContext, this.javaClass)
        restartServiceIntent.setPackage(packageName)
        startService(restartServiceIntent)
        super.onTaskRemoved(rootIntent)
    }
}