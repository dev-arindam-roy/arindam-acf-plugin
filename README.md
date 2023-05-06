# Custom ACF Plugin
### A custom ACF Plugin for any frameworks and projects

## Installation or Configuration

> **Just attach the js and css file in your page**

```shell
<link rel="stylesheet" href="css/arindam-acf.min.css">
<script src="js/jquery.arindam-acf.min.js"></script>
```

## Dependency

> **You need to add jquery.min.js file**

## How to call it ?

```shell
// just create a div with id

<div id="exampleAcf"></div>

// and call and customize by below script
<script>
$(document).ready(function() {
    $('#exampleAcf').arindamACF({
      buttonText: 'Start Creating ACF',
      headerTitle: 'Create Your Custom ACF',
      saveChangesAction: function(acfJson) {
        // your ajax call to save the acf json
        console.log(acfJson);
        $.fn.arindamACF.acfClose();
      }
    });
});
</script>
```

### Check The Demo?
<a href="https://dev-arindam-roy.github.io/arindam-acf-plugin/">https://dev-arindam-roy.github.io/arindam-acf-plugin/</a>

![ACF_PLUG](https://user-images.githubusercontent.com/24665327/236636572-8ad07e59-d0e7-4d17-8066-ef90c4d0cead.png)

### Check The Demo?
<a href="https://dev-arindam-roy.github.io/arindam-acf-plugin/">https://dev-arindam-roy.github.io/arindam-acf-plugin/</a>

