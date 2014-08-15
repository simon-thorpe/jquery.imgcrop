jquery.imgcrop
==============

### Recommended Sitecore Usage
```
<ItemTemplate>
	<li>
		<div class="staff">
			<div class="fullName"><%#:Eval("FullName")%></div>
			<div data-crop-width="50" data-crop-height="100" style="width:50px;height:100px">
				<sc:Image runat="server" CssStyle="display:none" Field="image" MaxWidth="50*3" MaxHeight="100*3" />
			</div>
			<div class="description"><%#:Eval("Description")%></div>
		</div>
	</li>
</ItemTemplate>
```
- CssStyle display:none in &lt;sc:Image&gt; and wrapper div with fixed width+height to prevent flicker of natural sized image before plugin has activated.
