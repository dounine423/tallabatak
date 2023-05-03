import {GET_PUZZLE_DATA_SUCCESS,SET_SOCRE,GET_PUZZLE_DATA_FAIL,BASE_URL} from '../actionType'

const initial_state={
    difficutly:0,
    puzzle_imgs:[],
    post_tile:"",
    post_img:"",
    error:"",
    flag:false,
    time:0
}

const getPuzzleDifficulty=(count)=>{
    switch(count){
        case "6":
            return 3;
            break;
        case "10":
            return 4;
            break;
        case "15":
            return 5;
            break;
        case "21":
            return 6;
            break;
        default:
            return 0;
            break;
    }
}

const setPuzzleData=(img_count,puzzle_imgs)=>{
    let difficulty=getPuzzleDifficulty(img_count);
    let randomArray=[];
    let tempRow=[];
    let temp=[];
    const cardCount=puzzle_imgs.length*2;
    
    for(let i=1;i<=cardCount;i++){
        randomArray.push({id:(i % (cardCount/2)),img:puzzle_imgs[i%(cardCount/2)]});
    }
    for(let i=cardCount;i>0;i--){
        let rand=(Math.floor(Math.random()*100))%i;
        tempRow.push({id:randomArray[rand].id,url:BASE_URL+randomArray[rand].img.uri,show:false,check:false})
        if(i%difficulty==1){
        temp.push(tempRow);
        tempRow=[];
        }
        randomArray.splice(rand,1)
    }
    return temp;
}

export default function puzzleReducer(state=initial_state,action){
    switch(action.type){
        case GET_PUZZLE_DATA_SUCCESS:
            console.log("here is reducer")
            const {title,post_img,puzzle_difficult,puzzle_imgs,time_line} =action.payload;
            let temp=getPuzzleDifficulty(puzzle_difficult);
            let puzzle_data=setPuzzleData(puzzle_difficult,puzzle_imgs);
            return{
                ...state,
                difficulty:temp,
                puzzle_data:puzzle_data,
                post_title:title,
                post_img:post_img,
                img_count:puzzle_difficult,
                flag:true,
                time:time_line
            }
        case GET_PUZZLE_DATA_FAIL:
            return {
                ...state,
                error:action.payload
            }
        case SET_SOCRE:
            return{
                ...state
            }
        default:
            return state
    }
}