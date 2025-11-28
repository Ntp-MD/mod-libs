<script>
    // 1. Initialize the plugin definition
    if (window.ModWebGlRipplesInit) {
        ModWebGlRipplesInit();
    }
    
    // 2. Call the jQuery plugin on the element
    $(document).ready(function() {
        $('#target').ripples({
            resolution: 512, // Higher resolution for smoother ripples
            perturbance: 0.04
        });
    });
</script>
