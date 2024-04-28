export class Employee{

    #Id
    #FirstName
    #LastName
    constructor(Id, FirstName,LastName){
        this.#Id=Id;
        this.#FirstName=FirstName
        this.#LastName=LastName
    }


    toJSON() {
        return {
          Id: this.#Id,
          FirstName: this.#FirstName,
          LastName: this.#LastName
        };
      }
    /////////
    getId() {
        return this.#Id;
      }
        
    setId(id) {
        if (typeof id === 'number') {
            this.#Id = id;
        }
    }
    /////////
    getFirstName() {
        return this.#FirstName;
      }

    setFirstName(FirstName){
        if (typeof FirstName === 'string'){
        this.#FirstName = FirstName;
    }
    } 
    ////////
    getLastName() {
        return this.#LastName;
     }

    setId(LastName){
    if (typeof LastName === 'string'){
        this.#LastName = LastName;        }
    }

}