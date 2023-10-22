class TeaService {

    getTea(type){
        if (type==="white"){
            return "White";
        }
        return "Black";
    }

}
module.exports = TeaService;