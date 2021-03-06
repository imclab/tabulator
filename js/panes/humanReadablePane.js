/*   Human-readable Pane
**
**  This outline pane contains the document contents for an HTML document
**  This is for peeking at a page, because the user might not want to leave the tabulator.
*/
tabulator.panes.register({
    
    icon: tabulator.Icon.src.icon_visit,
    
    name: 'humanReadable',
    
    label: function(subject, myDocument) {
        // Prevent infinite recursion with iframe loading a web page which uses tabulator which shows iframe...
        if (tabulator.isExtension && myDocument.location == subject.uri) return null;
        var kb = tabulator.kb;
        var ns = tabulator.ns;

        //   See aslo tthe source pane, which has lower precedence.
        
        var allowed = ['text/plain',
                       'text/html','application/xhtml+xml',
                        'image/png', 'image/jpeg', 'application/pdf'];
 
        var displayable = function(kb, x, displayables) {
            var cts = kb.fetcher.getHeader(x, 'content-type');
            if (cts) {
                for (var j=0; j<cts.length; j++) {
                    for (var k=0; k < displayables.length; k++) {
                        if (cts[j].indexOf(displayables[k]) >= 0) {
                            return true;
                        }
                    }
                }
            }
            return false;
        };
        
        var t = kb.findTypeURIs(subject);
        if (t[ns.link('WebPage').uri]) return "view";

        if (displayable(kb, subject, allowed)) return "View";

        return null;
    },
    
    render: function(subject, myDocument) {
        var div = myDocument.createElement("div")

        //  @@ When we can, use CSP to turn off scripts within the iframe
        div.setAttribute('class', 'docView')    
        var iframe = myDocument.createElement("IFRAME")
        iframe.setAttribute('src', subject.uri)
        iframe.setAttribute('class', 'doc')
        iframe.setAttribute('style', 'resize = both; height: 120em; width:80em;')
//        iframe.setAttribute('height', '480')
//        iframe.setAttribute('width', '640')
        var tr = myDocument.createElement('TR')
        tr.appendChild(iframe)
        div.appendChild(tr)
        return div
    }
}, true);
//ends


