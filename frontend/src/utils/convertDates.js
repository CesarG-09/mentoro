const daysOfWeek = {
    "Monday": "Lunes",
    "Tuesday": "Martes",
    "Wednesday": "Miércoles",
    "Thursday": "Jueves",
    "Friday": "Viernes",
    "Saturday": "Sábado",
    "Sunday": "Domingo"
};

const months = {
    "January": "Enero",
    "February": "Febrero",
    "March": "Marzo",
    "April": "Abril",
    "May": "Mayo",
    "June": "Junio",
    "July": "Julio",
    "August": "Agosto",
    "September": "Septiembre",
    "October": "Octubre",
    "November": "Noviembre",
    "December": "Diciembre"
};

export function convertDateToSpanish(text) {
    for (let day in daysOfWeek) {
        text = text.replace(new RegExp(day, 'g'), daysOfWeek[day]);
    }

    for (let month in months) {
        text = text.replace(new RegExp(month, 'g'), months[month]);
    }

    return text;
}
