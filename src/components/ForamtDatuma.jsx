export default function FormatDatuma({datum}){
    if(!datum){
        return '-';
    }
    const d = new Date(datum);
    if(isNaN(d.getTime())){
        return '-';
    }
    return Intl.DateTimeFormat('hr-HR',{
        day:'2-digit',
        month:'2-digit',
        year:'numeric'
    }).format(d)
}
