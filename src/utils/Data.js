export default {
    folders: [
        {
            parentId: null,
            id: 1,
            name: "HTML5|JavaScript|SQL",
            isShow: true,
            isChecked: false,
            type: "html",
            isStretch: true,
            children: [
                {
                    parentId: 1,
                    id: 11,
                    name: "The HTML",
                    isShow: true,
                    isChecked: false,
                    type: "html",
                    updateTime: "2019-2-8",
                    content: `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Title</title>
    </head>
    <style>
        #header {
            background-color:black;
            color:white;
            text-align:center;
            padding:5px;
        }
        #nav {
            line-height:30px;
            background-color:#eeeeee;
            height:300px;
            width:100px;
            float:left;
            padding:5px;
        }
        #section {
            width:350px;
            float:left;
            padding:10px;
        }
        #footer {
            background-color:black;
            color:white;
            clear:both;
            text-align:center;
            padding:5px;
        }
    </style>
    <body>
    
    <div id="header">
        <h1>City Gallery</h1>
    </div>
    
    <div id="nav">
        London<br>
        Paris<br>
        Tokyo<br>
    </div>
    
    <div id="section">
        <h1>London</h1>
        <p>
            London is the capital city of England. It is the most populous city in the United Kingdom,
            with a metropolitan area of over 13 million inhabitants.
        </p>
        <p>
            Standing on the River Thames, London has been a major settlement for two millennia,
            its history going back to its founding by the Romans, who named it Londinium.
        </p>
    </div>
    
    <div id="footer">
        Copyright W3School.com.cn
    </div>
    <script>
        for (var i = 0; i < 10; i++) {
            console.info("Hello World");
        }
    </script>
    </body>
    </html>`
                },
                {
                    parentId: 1,
                    id: 12,
                    name: "The JAVAScript",
                    isShow: true,
                    isChecked: false,
                    type: "javascript",
                    updateTime: "2019-2-8",
                    content:
                        `function startTime() {
        var today = new Date()
        var h = today.getHours()
        var m = today.getMinutes()
        var s = today.getSeconds()
        // add a zero in front of numbers<10
        m = checkTime(m)
        s = checkTime(s)
        document.getElementById('txt').innerHTML = h + ":" + m + ":" + s
        t = setTimeout('startTime()', 500)
    }
    
    function checkTime(i) {
        if (i < 10) {
            i = "0" + i
        }
        return i
    }`
                },
                {
                    parentId: 1,
                    id: 13,
                    name: "HELLO WORLD",
                    isShow: true,
                    isChecked: false,
                    type: 'java',
                    updateTime: "2019-2-8",
                    content: `public class HelloWorld {
        public static void main(String[] args) {
            System.out.println("Hello World");
        }
    }`
                },
                {
                    parentId: 1,
                    id: 14,
                    name: "The SQL",
                    isShow: true,
                    isChecked: false,
                    type: 'sql',
                    updateTime: "2019-2-8",
                    content: `SELECT LastName,FirstName FROM Persons;
    UPDATE Person SET FirstName = 'Fred' WHERE LastName = 'Wilson'`,
                },
            ],
        },
        {
            parentId: null,
            id: 999,
            name: "DEFAULT",
            isShow: false,
            isStretch: true,
            isChecked: false,
            children: [],
        }
    ],
}