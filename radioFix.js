// _getFormData

if ( form[el.name] instanceof RadioNodeList ) {
    const inputs = Array.from(form[el.name]);
    if ( inputs.every(i => i.disabled) ) FD.delete(k);
    let values = inputs.map(i => i.type === "checkbox" ? i.checked || false : i.value);
    FD.set(el.name, JSON.stringify(values));
    dtypes[el.name] = "Radio";
}

if ( form[el.name] instanceof RadioNodeList ) {
    const inputs = Array.from(form[el.name]);
    if ( inputs.every(i => i.disabled) ) FD.delete(k);
    let values = inputs.map(i => i.type === "checkbox" ? i.checked || false : i.value);
    FD.set(el.name, JSON.stringify(values));
    dtypes[el.name] = "Radio";
}

if ( form[el.name] instanceof RadioNodeList ) {
        
    const inputs = Array.from(form[el.name]);
    if ( inputs.every(i => i.disabled) ) FD.delete(k);
    
    let values = "";
    values = inputs.map(i => i.checked ? i.value : false).filter(i => i);
    
    FD.set(el.name, JSON.stringify(values[0]));
    dtypes[el.name] = 'Radio';
  }


// _render

if ( focus && focus.name ) {
    const input = this.form[focus.name];
    if ( input ) input.focus();
  }

if ( focus && focus.name ) {
    const input = this.form[focus.name];
    if ( input ) { 
        if (input  instanceof RadioNodeList) {
            var target;
          function matchValue(currentValue, index, arr) {
              if (currentValue.value === focus.value) {target = focus}
          }
            input.forEach(matchValue)
            target.focus()
        }
        else {input.focus()}
    };
}