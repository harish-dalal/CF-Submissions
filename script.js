let userData = []

let uniqueProblems = {}

var myChart;

let _type = "default"
let startdatets = NaN
let enddatets = NaN

const color = ['rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)']

const bordercolor = [
				'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)']     

let handleinput = document.getElementById("user_handle")
const getUserData = () =>{
	let userHandle = handleinput.value.trim()
	userData = []
	uniqueProblems = {}
	fetch(`https://codeforces.com/api/user.status?handle=${userHandle}&from=1`)
	.then(response => {
		if(response.ok) return response.json();
		else throw new Error('Something went wrong')
	})
	.then(data=>{
			userData = data.result
			getUniqueProblems()
			catProblems()
		})
	.catch((error)=>{
		console.log(error)
		alert("Invalid request")
	})

} 


// const onSearchUser = () =>{

// }

const getUniqueProblems = () =>{
	let count = 0;
	userData.forEach(el=>{
		if(el.verdict === "OK"){
			count++;
			let name = el.problem.name;
			if (!(name in uniqueProblems)){
				uniqueProblems[name] = el;
			}
			else if((name in uniqueProblems) && el.author.participantType === "CONTESTANT"){
				uniqueProblems[name] = el;
			}
		}
	})
}

const applyDate = () => {
	let startdate = document.getElementById('start-date').value
	let enddate = document.getElementById('end-date').value
	startdatets = Date.parse(startdate) / 1000
	enddatets = Date.parse(enddate) / 1000
	// console.log(startdatets , enddatets)
	catProblems()

}

const resetDate = () => {
	startdatets = NaN
	enddatets = NaN
	document.getElementById('start-date').value = ''
	document.getElementById('end-date').value = ''
	catProblems()
}

const settype = (type = "default") => {
	_type = type
	catProblems()
}

const catProblems = () =>{
	if(Object.keys(uniqueProblems).length == 0) return;
	let arr = new Array(5000).fill(0);	
	let unknown = 0;
	// console.log(Object.values(uniqueProblems).length)
	if(_type == "default"){
		Object.values(uniqueProblems).forEach(prob=>{
			if((prob.creationTimeSeconds >= startdatets || isNaN(startdatets)) && (prob.creationTimeSeconds <= enddatets || isNaN(enddatets))){
				if(prob.problem.rating == undefined) unknown++;
				else arr[parseInt(prob.problem.rating)]++;
			}
		})
	}
	else if(_type == "onlyPractice"){
		Object.values(uniqueProblems).forEach(prob=>{
			if(prob.author.participantType != "CONTESTANT"){
				if((prob.creationTimeSeconds >= startdatets || isNaN(startdatets)) && (prob.creationTimeSeconds <= enddatets || isNaN(enddatets))){
					if(prob.problem.rating == undefined) unknown++;
					else arr[parseInt(prob.problem.rating)]++;
				}
			}
		})
	}
	else{
		Object.values(uniqueProblems).forEach(prob=>{
			if(prob.author.participantType == "CONTESTANT"){
				if((prob.creationTimeSeconds >= startdatets || isNaN(startdatets)) && (prob.creationTimeSeconds <= enddatets || isNaN(enddatets))){
					if(prob.problem.rating == undefined) unknown++;
					else arr[parseInt(prob.problem.rating)]++;
				}
			}
		})	
	}

	let label = [];
	let data = [];
	for(let i=0 ; i<5000 ; i++){
		if(arr[i] != 0) {
			label.push(i)
			data.push(arr[i])
		}
	}

	if(unknown != 0){
		label.push("unknown");
		data.push(unknown);
	}
	document.getElementById('total_solved').innerHTML = `total solved ${data.reduce((a,b)=>a+b , 0)}`
	if(myChart != undefined) myChart.destroy()
	createGraph(label , data)
}




let ctx = document.getElementById('submissionGraph')

const createGraph = (label , data) =>{
	myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: label,
        datasets: [{
            label: 'count of accepted solutions',
            data: data,
            backgroundColor: color,
            borderColor: bordercolor,
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true,
                title:{
                	display : true,
                	text : 'accepted solutions count'
                }       
            },
            x: {
            	title: {
            		display : true,
            		text : 'questions difficulty'
            	}
            }
        }
    }
});
}



// console.log("hello")
// fetch('http://example.com/movies.json')
//   .then(response => response.json())
//   .then(data => console.log(data));