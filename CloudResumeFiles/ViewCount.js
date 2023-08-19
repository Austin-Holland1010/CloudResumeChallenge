async function getViewCount() {
    try{
    let response = await fetch('https://unmlmtifxb.execute-api.us-east-2.amazonaws.com/items');
    console.log(response)
    let data = await response.json()
    console.log(data)
    document.getElementById('viewCountLabel').innerHTML
     = "This page has been viewed " + data[0].ViewCount + " times"; 
    }
    catch {
        document.getElementById('viewCountLabel').innerHTML
         = "Page View Counter Not Working" 
    }
}