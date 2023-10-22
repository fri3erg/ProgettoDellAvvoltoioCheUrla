class TeaService {

    getTea(type){
        if (type==="white"){
            return "White";
        }
        return "Blacks";
    }

}
module.exports = TeaService;