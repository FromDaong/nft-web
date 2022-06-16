import Model from "@models/Model"

const capitalizeModelAddresses = async () => {
    return Model.find((err, models) => {
        if(err) {
            console.log(err)
            return
        }

        return models.forEach(async model => {
            const address = model.address.toUpperCase()
            await Model.findByIdAndUpdate(model._id, {
                $set: {address}
            })

            return console.log("Saved address " + address)
        }   
        )
    })
}

capitalizeModelAddresses()