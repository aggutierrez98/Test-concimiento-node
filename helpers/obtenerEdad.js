const obtenerEdad = (birthday) => {
    const birthdayDate = new Date(birthday);
    const date = new Date();
    let age = date.getFullYear() - birthdayDate.getFullYear();
    const mounth = date.getMonth() - birthdayDate.getMonth();

    if (mounth < 0 || (mounth === 0 && date.getDate() < bithday.getDate())) {
        age--;
    };

    return age;
};

module.exports = obtenerEdad;
