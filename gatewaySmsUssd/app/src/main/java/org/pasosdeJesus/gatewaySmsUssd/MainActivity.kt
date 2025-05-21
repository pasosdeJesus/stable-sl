package org.pasosdeJesus.gatewaySmsUssd

import kotlinx.coroutines.Dispatchers
import android.Manifest
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Bundle
import android.provider.Telephony
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TextField
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import androidx.core.content.ContextCompat.registerReceiver
import androidx.core.content.ContextCompat.startActivity
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.launch
import org.pasosdeJesus.gatewaySmsUssd.ui.theme.GatewaySMSUSSDTheme
import java.text.SimpleDateFormat
import java.util.Date

const val RC_CALL_PHONE = 1001
const val RC_READ_SMS = 1002
const val RC_SEND_SMS = 1003
const val RC_INTERNET = 1004

class MainActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            GatewaySMSUSSDTheme {
                Scaffold(modifier = Modifier.fillMaxSize()) { innerPadding ->
                    App(
                        name = "Gateway for stable-sl.pdJ.app",
                        activity = this,
                        modifier = Modifier.padding(innerPadding)
                    )
                }
            }
        }

    }


    //@RequiresApi(Build.VERSION_CODES.VANILLA_ICE_CREAM)
    @Composable
    fun App(name: String, activity: MainActivity?, modifier: Modifier = Modifier) {
        var recentLogs by remember { mutableStateOf("") }
        var ussdToDial by remember { mutableStateOf("#144#k") }
        var smsNumber by remember { mutableStateOf("23275234565") }
        var smsMessage by remember { mutableStateOf("Testing SMS") }

        Column {
            Text(
                text = name,
                fontSize = 32.sp
            )
            Row(horizontalArrangement = Arrangement.Center) {
                Button(modifier= Modifier, onClick = {
                    recentLogs = addLog(
                        recentLogs,
                        "Activating reading of SMS"
                    )
                    if (activity != null) {
                        if (ActivityCompat.checkSelfPermission(
                                activity,
                                Manifest.permission.RECEIVE_SMS
                            ) !=
                            PackageManager.PERMISSION_GRANTED ||
                            ActivityCompat.checkSelfPermission(
                                activity,
                                Manifest.permission.READ_SMS
                            ) !=
                            PackageManager.PERMISSION_GRANTED
                        ) {
                            if (ActivityCompat.shouldShowRequestPermissionRationale(
                                    activity,
                                    Manifest.permission.RECEIVE_SMS
                                ) ||
                                ActivityCompat.shouldShowRequestPermissionRationale(
                                    activity,
                                    Manifest.permission.READ_SMS
                                )
                            ) {
                                recentLogs = addLog(
                                    recentLogs,
                                    "Reading and receiving SMSs is required for on-ramping"
                                )
                            } else {
                                ActivityCompat.requestPermissions(
                                    activity,
                                    arrayOf(
                                        Manifest.permission.RECEIVE_SMS,
                                        Manifest.permission.READ_SMS
                                    ),
                                    RC_READ_SMS
                                )
                            }
                        } else {

                            val br = object : BroadcastReceiver() {
                                override fun onReceive(p0: Context?, p1: Intent?) {
                                    for (sms in Telephony.Sms.Intents.getMessagesFromIntent(
                                        p1
                                    )) {
                                        val smsSender = sms.originatingAddress
                                        val smsMessageBody = sms.displayMessageBody

                                        recentLogs = postMsg(
                                            activity = activity,
                                            recentLogs = recentLogs,
                                            sender = smsSender.toString(),
                                            msg = smsMessageBody
                                        )
                                        //if (smsSender == "the_number_that_you_expect_the_SMS_to_come_FROM") {

                                        //}
                                    }
                                }
                            }


                            registerReceiver(
                                activity,
                                br,
                                IntentFilter("android.provider.Telephony.SMS_RECEIVED"),
                                ContextCompat.RECEIVER_EXPORTED
                            )

                            startService(Intent(applicationContext, BgService::class.java))

                        }
                    }
                }) {
                    Text("Activate receiving SMS")
                }
            }
            Column {
                Text(
                    text = recentLogs,
                    modifier = Modifier.height(250.dp)
                )
                Button(
                    onClick = { recentLogs = addLog(recentLogs, "Test log entry") }
                ) {
                    Text("Test add Log")
                }
            }


            Row {
                TextField(
                    value = ussdToDial,
                    singleLine = true,
                        onValueChange = { ussdToDial = it },
                        label = { Text("USSD to dial") }
                    )
                    Button(
                        onClick = {
                            recentLogs = addLog(recentLogs, "Test dial $ussdToDial")
                            if (activity != null) {
                                val intent = Intent(Intent.ACTION_CALL, ussdToCallableUri(ussdToDial))
                                if (ActivityCompat.checkSelfPermission(
                                        activity,
                                        Manifest.permission.CALL_PHONE
                                    ) != PackageManager.PERMISSION_GRANTED
                                ) {
                                    if (ActivityCompat.shouldShowRequestPermissionRationale(
                                            activity,
                                            Manifest.permission.CALL_PHONE
                                        )
                                    ) {
                                        recentLogs = addLog(
                                            recentLogs,
                                            "Call permission is required to dial USSD for off-ramping"
                                        )
                                    } else {
                                        ActivityCompat.requestPermissions(
                                            activity,
                                            arrayOf(Manifest.permission.CALL_PHONE),
                                            RC_CALL_PHONE
                                        )
                                    }
                                } else {
                                    startActivity(activity, intent, null)
                                }
                            }
                    }
                ) {
                    Text("Test dial USSD")
                }
            }


            Row(verticalAlignment = Alignment.CenterVertically) {
                Column(verticalArrangement = Arrangement.Center) {
                    TextField(
                        value = smsNumber,
                        singleLine = true,
                        onValueChange = { smsNumber = it },
                        label = { Text("Number to send SMS") }
                    )
                    TextField(
                        value = smsMessage,
                        singleLine = true,
                        onValueChange = { smsMessage = it },
                        label = { Text("SMS Message") }
                    )
                }
                Button(onClick = {
                    recentLogs = addLog(
                        recentLogs,
                        "Sending SMS message '$smsMessage' to '$smsNumber'"
                    )
                    if (activity != null) {
                        val intent = Intent(Intent.ACTION_SENDTO).apply {
                            data = Uri.parse("smsto:$smsNumber")
                            putExtra("sms_body", smsMessage)
                        }
                        if (ActivityCompat.checkSelfPermission(activity, Manifest.permission.SEND_SMS) !=
                            PackageManager.PERMISSION_GRANTED
                        ) {
                            if (ActivityCompat.shouldShowRequestPermissionRationale(activity, Manifest.permission.SEND_SMS) ) {
                                recentLogs = addLog(
                                    recentLogs,
                                    "Sending SMS is for you to test"
                                )
                            } else {
                                ActivityCompat.requestPermissions(
                                    activity,
                                    arrayOf(Manifest.permission.SEND_SMS),
                                    RC_SEND_SMS
                                )
                            }
                        } else {
                            startActivity(activity, intent, null)
                        }
                    }
                }) {
                    Text("Test Send SMS")
                }
            }
            Button(onClick = {
                if (activity != null && ActivityCompat.checkSelfPermission(
                            activity,
                            Manifest.permission.INTERNET
                        ) != PackageManager.PERMISSION_GRANTED
                    ) {
                        if (ActivityCompat.shouldShowRequestPermissionRationale(
                                activity,
                                Manifest.permission.INTERNET
                            )
                        ) {
                            recentLogs = addLog(
                                recentLogs,
                                "Internet to communicate with coordinatig backend"
                            )
                        } else {
                            ActivityCompat.requestPermissions(
                                activity,
                                arrayOf(Manifest.permission.INTERNET),
                                RC_INTERNET
                            )
                        }
                } else {
                    val scope = CoroutineScope(Dispatchers.IO)
                    scope.launch {
                        try {
                            val apiData =
                                fetchApiData("https://android-kotlin-fun-mars-server.appspot.com/photos")
                            recentLogs = addLog(
                                recentLogs,
                                "Received from API '$apiData'"
                            )
                        } catch (e: Exception) {
                            e.printStackTrace()
                            recentLogs = addLog(
                                recentLogs,
                                "Couldn't receive from API"
                            )
                        }
                    }
                }
            }) {
                Text("Get from API")
            }
            Button(onClick = {
                recentLogs = postMsg(
                    activity = activity,
                    recentLogs = recentLogs,
                    sender = "012345678",
                    msg = "Testing"
                )
            }) {
                Text("Send POST to API")
            }
        }


    }

    private fun ussdToCallableUri(ussd: String): Uri? {
        var uriString: String? = ""

        if (!ussd.startsWith("tel:")) uriString += "tel:"

        for (c in ussd.toCharArray()) {
            uriString += if (c == '#') Uri.encode("#")
            else c
        }

        return Uri.parse(uriString)
    }

    fun addLog(logs: String, newMsg: String): String {
        val logsList = logs.split("\n").toTypedArray()
        val sdf = SimpleDateFormat("dd/M/yyyy hh:mm:ss")
        val currentDate = sdf.format(Date())
        val res = logsList.plus("[$currentDate] $newMsg")
        if (res.size > 5) {
            res[0] = ""
        }
        val res2 = res.filter { it != "" }.toTypedArray()
        return res2.joinToString(separator = "\n")
    }

    fun postMsg(activity: MainActivity?, recentLogs: String, sender: String, msg: String): String {
        var res:String
        var recentLogs2: String = recentLogs

        if (activity != null && ActivityCompat.checkSelfPermission(
                activity,
                Manifest.permission.INTERNET
            ) != PackageManager.PERMISSION_GRANTED
        ) {
            if (ActivityCompat.shouldShowRequestPermissionRationale(
                    activity,
                    Manifest.permission.INTERNET
                )
            ) {
                recentLogs2 = addLog(
                    recentLogs,
                    "Internet to communicate with coordinating backend"
                )
            } else {
                ActivityCompat.requestPermissions(
                    activity,
                    arrayOf(Manifest.permission.INTERNET),
                    RC_INTERNET
                )
            }
        } else {
            val scope = CoroutineScope(Dispatchers.IO)
            scope.launch {
                try {
                    res = post(url = "https://stable-sl.pdJ.app/api/sms_received",
                        json = "{\"sender\": \"${sender}\", \"msg\": \"${msg}\"}")
                    recentLogs2 = addLog(
                        recentLogs,
                        "Posted test $res"
                    )
                } catch (e: Exception) {
                    e.printStackTrace()
                    recentLogs2 = addLog(
                        recentLogs,
                        "Couldn't post"
                    )
                }
            }
        }
        return recentLogs2
    }



    //@androidx.annotation.RequiresApi(android.os.Build.VERSION_CODES.VANILLA_ICE_CREAM)
    @Preview(showBackground = true)
    @Composable
    fun GatewayPreview() {
        GatewaySMSUSSDTheme {
            App(name = "Preview of Gateway for stable-sl.pdJ.app", activity = null)
        }
    }

}